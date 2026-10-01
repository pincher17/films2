"use client";

/**
 * Автоподгрузка следующей страницы, когда пользователь долистал до низа.
 *
 * Ставится рядом с кнопкой «Показать ещё»: кнопка остаётся (доступность,
 * поисковики, ручное управление), а лента подгружается сама за 400px до конца.
 *
 * Защита от повторов: пока не изменилось количество карточек, повторный запрос
 * не уходит — иначе при пустой выдаче был бы бесконечный цикл.
 */

import React, { useEffect, useRef } from "react";

type Props = {
  /** Сколько карточек сейчас на странице */
  count: number;
  /** Загрузить следующую страницу */
  onLoad: () => void;
  /** Выключить автоподгрузку (например, всё загружено) */
  disabled?: boolean;
};

const InfiniteScroll: React.FC<Props> = ({ count, onLoad, disabled }) => {
  const sentinel = useRef<HTMLDivElement | null>(null);
  const lastCount = useRef(count);
  const waiting = useRef(false);

  // как только пришли новые карточки — снимаем блокировку
  useEffect(() => {
    if (count !== lastCount.current) {
      lastCount.current = count;
      waiting.current = false;
    }
  }, [count]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || disabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || waiting.current) return;
        waiting.current = true;
        onLoad();
      },
      { rootMargin: "400px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onLoad, disabled]);

  if (disabled) return null;

  return <div ref={sentinel} style={{ height: 1 }} aria-hidden="true" />;
};

export default InfiniteScroll;
