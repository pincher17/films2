"use client";

import React from "react";
import { Wrapper, Segment } from "./StudioTypeSwitcher.styles";

/**
 * Переключатель типа контента на странице студии.
 *
 * В отличие от разделов каталога, он не уводит на другую страницу, а меняет
 * фильтр внутри студии — чтобы смотреть «только сериалы Netflix».
 */
const OPTIONS = [
  { value: "1", label: "Фильмы" },
  { value: "2", label: "Сериалы" },
  { value: "3", label: "Мультфильмы" },
];

export default function StudioTypeSwitcher({
  value,
  onChange,
}: {
  value: string[];
  onChange: (types: string[]) => void;
}) {
  // «Всё» больше нет: у студии всегда выбран один тип
  const current = value.length === 1 ? value[0] : "1";

  return (
    <Wrapper role="tablist" aria-label="Тип контента">
      {OPTIONS.map((option) => {
        const active = option.value === current;
        return (
          <Segment
            key={option.value}
            as={"button" as any}
            type="button"
            role="tab"
            aria-selected={active}
            $active={active}
            onClick={() => onChange(option.value.split(","))}
          >
            {option.label}
          </Segment>
        );
      })}
    </Wrapper>
  );
}
