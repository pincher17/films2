"use client";

/**
 * Поиск для телевизора.
 *
 * Настоящего input нет намеренно: на телевизоре он поднимает системную
 * клавиатуру, которая закрывает полэкрана и плохо управляется пультом.
 * Вместо него — строка запроса (обычный div) и своя клавиатура, по которой
 * ходим стрелками.
 *
 * Раскладка — привычная ЙЦУКЕН, как на настоящей клавиатуре: так человек
 * находит букву там, где ждёт. Цифры — отдельным блоком ниже.
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

const ROWS = ["йцукенгшщзхъ", "фывапролджэ", "ячсмитьбю"];
const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const Query = styled.div`
  min-height: 66px;
  padding: 8px 22px;
  border: 2px solid #333;
  border-radius: 12px;
  font-size: 28px;
  color: #fff;
  background: #111;
  margin-bottom: 22px;
  display: flex;
  align-items: center;

  .placeholder {
    color: #5f5f5f;
    font-size: 20px;
  }

  .caret {
    display: inline-block;
    width: 3px;
    height: 30px;
    margin-left: 5px;
    background: #d41515;
  }
`;

const Keys = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 18px;
`;

const KeysRow = styled.div`
  display: flex;
  gap: 12px;
`;

const Key = styled.button<{ $muted?: boolean }>`
  min-width: 62px;
  height: 60px;
  padding: 0 14px;
  border-radius: 10px;
  border: 2px solid #2a2a2a;
  background: #161616;
  /* Буквы нарочно приглушённые: чистый белый на сорока кнопках бьёт по глазам */
  color: ${(props) => (props.$muted ? "#a8a8a8" : "#c4c4c4")};
  font-size: 23px;
  cursor: pointer;
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.12s ease;

  &:focus,
  &:focus-visible,
  &.tv-focused {
    background: #d41515;
    border-color: #d41515;
    color: #fff;
    outline: none;
  }

  svg {
    width: 22px;
    height: 22px;
    display: block;
  }
`;

const WideKey = styled(Key)`
  min-width: 168px;
  font-size: 17px;
`;

const Hint = styled.p`
  color: #8a8a8a;
  font-size: 16px;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  height: 54px;
  padding: 0 24px;
  border-radius: 10px;
  border: 2px solid #2f2f2f;
  background: #141414;
  color: #d0d0d0;
  font-size: 17px;
  text-decoration: none;
  outline: none;
  margin-top: 8px;

  &:focus,
  &:focus-visible,
  &.tv-focused {
    background: #d41515;
    border-color: #d41515;
    color: #fff;
    outline: none;
  }
`;

const BackspaceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 5H9L3 12l6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z" />
    <path d="M17 9l-5 6M12 9l5 6" />
  </svg>
);

const ClearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const SpaceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 10v4h16v-4" />
  </svg>
);

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

  return (
    <main>
      <TvRow>
        <h2>Поиск</h2>

        <Query>
          {query ? (
            <>
              {query}
              <span className="caret" />
            </>
          ) : (
            <span className="placeholder">Введите название стрелками</span>
          )}
        </Query>

        <Keys>
          {ROWS.map((row, rowIndex) => (
            <KeysRow key={rowIndex} data-tv-row>
              {row.split("").map((letter) => (
                <Key key={letter} $muted data-tv-focus onClick={() => press(letter)}>
                  {letter}
                </Key>
              ))}
            </KeysRow>
          ))}

          <KeysRow data-tv-row>
            {DIGITS.map((digit) => (
              <Key key={digit} data-tv-focus onClick={() => press(digit)}>
                {digit}
              </Key>
            ))}
          </KeysRow>

          <KeysRow data-tv-row>
            <WideKey data-tv-focus onClick={() => press(" ")}>
              <SpaceIcon />
              Пробел
            </WideKey>
            <WideKey data-tv-focus onClick={erase}>
              <BackspaceIcon />
              Стереть
            </WideKey>
            <WideKey data-tv-focus onClick={() => setQuery("")}>
              <ClearIcon />
              Очистить
            </WideKey>
          </KeysRow>
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

      <BackButton href="/tv" data-tv-focus>
        Назад на главную
      </BackButton>
    </main>
  );
}
