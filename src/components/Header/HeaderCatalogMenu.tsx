"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import s from "./Header.module.css";

/**
 * «Все фильмы» в шапке с выпадающим выбором раздела.
 *
 * Открывается при наведении (компьютер) и по нажатию (телефон).
 * Внутри — три раздела каталога.
 */
const SECTIONS = [
  { href: "/films", label: "Все фильмы" },
  { href: "/series", label: "Все сериалы" },
  { href: "/cartoons", label: "Мультфильмы" },
];

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
    <div className={s.dropdown} onMouseEnter={openMenu} onMouseLeave={closeMenu}>
      <button
        type="button"
        className={`${s.nav_item} ${isSection ? s.active : ""} ${s.dropdown_trigger}`}
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Все фильмы
        <span className={`${s.dropdown_caret} ${open ? s.dropdown_caret_open : ""}`} />
      </button>

      {open && (
        <div className={s.dropdown_menu} role="menu">
          {SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className={`${s.dropdown_item} ${pathname === section.href ? s.dropdown_item_active : ""}`}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {section.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
