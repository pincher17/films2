"use client";

/**
 * Сохранённое для телевизора: те же карточки, что в ряду на главной.
 */

import React from "react";
import styled from "styled-components";
import { TvBack, TvPosterCard, TvRowScroll } from "@/components/tv/TvParts";

type Card = {
  id: number | string;
  name: string;
  poster?: { url?: string; previewUrl?: string } | null;
};

const Title = styled.h1`
  font-size: 28px;
  margin: 18px 0 18px;
`;

const Empty = styled.p`
  color: #8a8a8a;
  font-size: 18px;
`;

export default function TvSavedPage() {
  const [items, setItems] = React.useState<Card[] | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/saved", { cache: "no-store" });
        const data = await response.json();
        if (!cancelled) setItems((data?.docs || []).filter((item: Card) => item?.id && item?.name));
      } catch {
        if (!cancelled) setItems([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main>
      <TvBack />
      <Title>Сохранённое</Title>

      {items === null ? <Empty>Загружаю…</Empty> : null}

      {items && !items.length ? (
        <Empty>Пока ничего не сохранено. Нажмите закладку на карточке фильма.</Empty>
      ) : null}

      {items && items.length
        ? /* по шесть в ряд: длинный список остаётся рядами, а по рядам у нас
             и работает навигация пультом */
          Array.from({ length: Math.ceil(items.length / 6) }, (_, rowIndex) => (
            <TvRowScroll key={rowIndex} data-tv-row>
              {items.slice(rowIndex * 6, rowIndex * 6 + 6).map((item) => (
                <TvPosterCard
                  key={item.id}
                  href={`/tv/film/${item.id}`}
                  poster={item.poster?.previewUrl || item.poster?.url}
                  name={item.name}
                />
              ))}
            </TvRowScroll>
          ))
        : null}

    </main>
  );
}
