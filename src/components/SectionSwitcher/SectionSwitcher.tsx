"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrapper, Segment } from "./SectionSwitcher.styles";

/**
 * Переключатель разделов каталога.
 *
 * Сегментированный контрол: все три раздела видны сразу, активный подсвечен.
 * Это рекомендованный паттерн для переключения видов контента.
 */
const SECTIONS = [
  { href: "/films", label: "Фильмы" },
  { href: "/series", label: "Сериалы" },
  { href: "/cartoons", label: "Мультфильмы" },
];

export default function SectionSwitcher() {
  const pathname = usePathname();

  return (
    <Wrapper role="tablist" aria-label="Разделы каталога">
      {SECTIONS.map((section) => {
        const active = pathname === section.href;
        return (
          <Segment
            key={section.href}
            href={section.href}
            $active={active}
            role="tab"
            aria-selected={active}
          >
            {section.label}
          </Segment>
        );
      })}
    </Wrapper>
  );
}
