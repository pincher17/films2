"use client";

/**
 * Поиск для телевизора.
 *
 * Настоящего input нет намеренно: на телевизоре он поднимает системную
 * клавиатуру, которая закрывает полэкрана и плохо управляется пультом.
 * Вместо него — строка запроса (обычный div) и своя клавиатура, по которой
 * ходим стрелками.
 */

import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { TvPosterCard, TvRow, TvRowScroll } from "@/components/tv/TvParts";

type Card = {
  id: number | string;
  name: string;
  poster?: { url?: string; previewUrl?: string } | null;
};

const LETTERS = [
  "абвгдежзий",
  "клмнопрст",
  "уфхцчшщъы",
  "ьэюя1230",
];

const Query = styled.div`
  min-height: 64px;
  padding: 14px 22px;
  border: 2px solid #333;
  border-radius: 12px;
  font-size: 26px;
  color: #fff;
  background: #111;
  margin-bottom: 22px;

  .placeholder {
    color: #6a6a6a;
  }
`;

const Keys = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 26px;
`;

const KeysRow = styled.div`
  display: flex;
  gap: 10px;
`;

const Key = styled.button`
  min-width: 58px;
  height: 58px;
  padding: 0 12px;
  border-radius: 10px;
  border: 2px solid #2f2f2f;
  background: #161616;
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  outline: none;

  &:focus,
  &:focus-visible {
    background: #d41515;
    border-color: #d41515;
    outline: none;
  }
`;

const WideKey = styled(Key)`
  min-width: 150px;
  font-size: 18px;
`;

const Hint = styled.p`
  color: #8a8a8a;
  font-size: 16px;
`;

export default function TvSearchPage() {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Card[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const value = query.trim();
    if (value.length < 2) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(value)}`, {
          cache: "no-store",
        });
        const data = await response.json();
        if (!cancelled) setResults((data?.docs || []).slice(0, 20));
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  const press = (letter: string) => setQuery((current) => (current + letter).slice(0, 40));
  const erase = () => setQuery((current) => current.slice(0, -1));

  const rows: Array<Array<{ label: string; action: () => void; wide?: boolean }>> = LETTERS.map(
    (row) => row.split("").map((letter) => ({ label: letter, action: () => press(letter) }))
  );
  rows.push([
    { label: "Пробел", action: () => press(" "), wide: true },
    { label: "Стереть", action: erase, wide: true },
    { label: "Очистить", action: () => setQuery(""), wide: true },
  ]);

  return (
    <main>
      <TvRow>
        <h2>Поиск</h2>
        <Query>
          {query ? query : <span className="placeholder">Введите название стрелками</span>}
        </Query>

        <Keys>
          {rows.map((row, rowIndex) => (
            <KeysRow key={rowIndex} data-tv-row>
              {row.map((key) => (
                <Key
                  key={`${rowIndex}-${key.label}`}
                  data-tv-focus
                  onClick={key.action}
                  style={key.wide ? { minWidth: 130 } : undefined}
                >
                  {key.label}
                </Key>
              ))}
            </KeysRow>
          ))}
        </Keys>
      </TvRow>

      {loading ? <Hint>Ищу…</Hint> : null}

      {results.length ? (
        <TvRow>
          <h2>Найдено</h2>
          <TvRowScroll data-tv-row>
            {results.map((item) => (
              <TvPosterCard
                key={item.id}
                href={`/tv/film/${item.id}`}
                poster={item.poster?.previewUrl || item.poster?.url}
                name={item.name}
              />
            ))}
          </TvRowScroll>
        </TvRow>
      ) : query.trim().length >= 2 && !loading ? (
        <Hint>Ничего не нашлось. Попробуйте другое название.</Hint>
      ) : null}

      <Hint>
        <Link href="/tv" style={{ color: "#d41515", textDecoration: "none" }}>
          Назад на главную
        </Link>
      </Hint>
    </main>
  );
}
