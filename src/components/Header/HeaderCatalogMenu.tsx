"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import styled from "styled-components";

/**
 * «Все фильмы» в шапке с выпадающим выбором раздела.
 *
 * Стили заданы здесь, а не в CSS-модуле: модуль шапки подключается по-разному
 * на разных сборках, и кнопка из-за этого оставалась без оформления.
 */
const SECTIONS = [
  { href: "/films", label: "Все фильмы" },
  { href: "/series", label: "Все сериалы" },
  { href: "/cartoons", label: "Мультфильмы" },
];

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const Trigger = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: none;
  background: none;
  color: ${({ $active }) => ($active ? "#fff" : "rgba(255, 255, 255, 0.86)")};
  font-family: inherit;
  font-size: 17px;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.18s ease, opacity 0.18s ease;

  &:hover {
    color: #fff;
  }

  @media (max-width: 850px) {
    font-size: 15px;
  }
`;

const Caret = styled.span<{ $open?: boolean }>`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid currentColor;
  transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  transition: transform 0.18s ease;
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 14px);
  left: 0;
  min-width: 215px;
  padding: 6px;
  border-radius: 14px;
  background: #161616;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.6);
  z-index: 300;
`;

const Item = styled(Link)<{ $active?: boolean }>`
  display: block;
  padding: 11px 14px;
  border-radius: 10px;
  color: ${({ $active }) => ($active ? "#fff" : "rgba(255, 255, 255, 0.78)")};
  background: ${({ $active }) => ($active ? "rgba(201, 21, 26, 0.9)" : "transparent")};
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${({ $active }) =>
      $active ? "rgba(201, 21, 26, 0.9)" : "rgba(255, 255, 255, 0.08)"};
    color: #fff;
  }
`;

export default function HeaderCatalogMenu() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSection = SECTIONS.some((section) => section.href === pathname);

  const openMenu = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };

  const closeMenu = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 130);
  };

  React.useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  return (
    <Wrapper onMouseEnter={openMenu} onMouseLeave={closeMenu}>
      <Trigger
        type="button"
        $active={isSection}
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Все фильмы
        <Caret $open={open} aria-hidden />
      </Trigger>

      {open && (
        <Menu role="menu">
          {SECTIONS.map((section) => (
            <Item
              key={section.href}
              href={section.href}
              $active={pathname === section.href}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {section.label}
            </Item>
          ))}
        </Menu>
      )}
    </Wrapper>
  );
}
