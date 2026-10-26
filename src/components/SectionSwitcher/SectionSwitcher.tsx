"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Wrapper, Trigger, Caret, Menu, Item } from "./SectionSwitcher.styles";

/**
 * Переключатель разделов каталога.
 *
 * Сделан как крупный заголовок с выпадающим списком: сразу видно, в каком
 * разделе находишься, и одним движением можно перейти в другой. Меню
 * открывается и по наведению (десктоп), и по нажатию (телефон).
 */
const SECTIONS = [
  { href: "/films", label: "Все фильмы" },
  { href: "/series", label: "Все сериалы" },
  { href: "/cartoons", label: "Мультфильмы" },
];

export default function SectionSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = SECTIONS.find((section) => section.href === pathname) || SECTIONS[0];

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  /* Небольшая задержка закрытия: иначе меню исчезает, пока курсор
     проходит от заголовка к списку */
  const closeMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
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
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {current.label}
        <Caret $open={open} aria-hidden />
      </Trigger>

      <Menu $open={open} role="menu">
        {SECTIONS.map((section) => (
          <Item
            key={section.href}
            href={section.href}
            $active={section.href === current.href}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            {section.label}
          </Item>
        ))}
      </Menu>
    </Wrapper>
  );
}
