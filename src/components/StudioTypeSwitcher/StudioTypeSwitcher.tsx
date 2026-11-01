"use client";

import { Wrapper, Segment } from "./StudioTypeSwitcher.styles";

/**
 * Переключатель типа контента на странице студии.
 *
 * Ведёт на отдельные страницы обычными ссылками: переход перезагружает
 * страницу целиком, поэтому список карточек всегда собирается заново и
 * не смешивается с предыдущим разделом.
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
