"use client";

import Link from "next/link";
import { Wrapper, Segment } from "./StudioTypeSwitcher.styles";

/**
 * Переключатель типа контента на странице студии.
 *
 * Ведёт на отдельные страницы — так у каждого типа свой адрес и своя выдача,
 * без перезагрузки состояния и путаницы с фильтрами.
 */
const OPTIONS = [
  { path: "", label: "Фильмы" },
  { path: "/series", label: "Сериалы" },
  { path: "/cartoons", label: "Мультфильмы" },
];

export default function StudioTypeSwitcher({
  slug,
  active,
}: {
  slug: string;
  active: string;
}) {
  return (
    <Wrapper role="tablist" aria-label="Тип контента">
      {OPTIONS.map((option) => {
        const isActive = option.path === active;
        return (
          <Segment
            as={Link}
            key={option.path}
            href={`/studio/${slug}${option.path}`}
            $active={isActive}
            role="tab"
            aria-selected={isActive}
          >
            {option.label}
          </Segment>
        );
      })}
    </Wrapper>
  );
}
