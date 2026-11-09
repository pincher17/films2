"use client";

/**
 * Главная телевизионной версии.
 *
 * Ряды карточек, как у Netflix/Apple TV: продолжение просмотра, тренды, топ,
 * фильмы, сериалы. Управление — стрелками, фокус сразу на первой карточке.
 */

import React from "react";
import styled from "styled-components";
import { TvPosterCard, TvProgressCard, TvRow, TvRowScroll } from "@/components/tv/TvParts";

type Card = {
  id: number | string;
  name: string;
  poster?: { url?: string; previewUrl?: string } | null;
  year?: number | null;
  progress?: {
    percent?: number | null;
    seconds?: number;
    season?: number;
    episode?: number;
  } | null;
};

type Row = { title: string; items: Card[] };

const Loading = styled.div`
  padding: 80px 0;
  color: #9a9a9a;
  font-size: 20px;
`;

const ROWS: Array<{ title: string; url: string }> = [
  { title: "Продолжить просмотр", url: "/api/continue?limit=20" },
  { title: "Сейчас в тренде", url: "/api/catalog?task=trending&limit=20" },
  { title: "Топ рейтинга", url: "/api/catalog?task=top&limit=20" },
  { title: "Фильмы", url: "/api/catalog?task=catalog&types=1&limit=20" },
  { title: "Сериалы", url: "/api/catalog?task=catalog&types=2&limit=20" },
  { title: "Мультфильмы", url: "/api/catalog?task=catalog&types=3&limit=20" },
];

export default function TvHomePage() {
  const [rows, setRows] = React.useState<Row[]>([]);

  React.useEffect(() => {
    let cancelled = false;

    /* Ряды рисуем по мере готовности, а не ждём все сразу: иначе на телевизоре
       экран остаётся пустым, пока не ответят все запросы. */
    ROWS.forEach(async ({ title, url }) => {
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        const items: Card[] = (data.docs || data.items || []).filter(
          (item: Card) => item?.id && item?.name
        );
        if (cancelled || !items.length) return;
        setRows((current) => [...current, { title, items }]);
      } catch {
        undefined;
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!rows.length) return <Loading>Загружаю подборки…</Loading>;

  return (
    <main>
      {rows.map((row) => (
        <TvRow key={row.title}>
          <h2>{row.title}</h2>
          <TvRowScroll data-tv-row>
            {row.items.map((item) =>
              item.progress ? (
                <TvProgressCard
                  key={`${row.title}-${item.id}`}
                  href={`/tv/film/${item.id}`}
                  poster={item.poster?.previewUrl || item.poster?.url}
                  name={item.name}
                  percent={item.progress.percent ?? null}
                  subtitle={
                    item.progress.season && item.progress.episode
                      ? `Сезон ${item.progress.season}, серия ${item.progress.episode}`
                      : null
                  }
                />
              ) : (
                <TvPosterCard
                  key={`${row.title}-${item.id}`}
                  href={`/tv/film/${item.id}`}
                  poster={item.poster?.previewUrl || item.poster?.url}
                  name={item.name}
                />
              )
            )}
          </TvRowScroll>
        </TvRow>
      ))}
    </main>
  );
}
