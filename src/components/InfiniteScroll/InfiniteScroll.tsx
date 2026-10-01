"use client";

/**
 * Автоподгрузка следующей страницы при долистывании до низа.
 *
 * Важный момент: IntersectionObserver срабатывает только на ПЕРЕХОДЕ в зону
 * видимости. Если после подгрузки маячок остался на экране (или пользователь
 * быстро долистал), перехода нет, и загрузка больше не запускается. Поэтому
 * здесь два механизма: observer для мгновенной реакции и проверка позиции
 * при скролле и после каждой загрузки.
 */

import React, { useEffect, useRef } from "react";

type Props = {
  /** Сколько карточек сейчас на странице */
  count: number;
  /** Загрузить следующую страницу */
  onLoad: () => void;
  /** Выключить автоподгрузку (всё загружено или идёт смена фильтров) */
  disabled?: boolean;
};

const MARGIN = 400;

const InfiniteScroll: React.FC<Props> = ({ count, onLoad, disabled }) => {
  const sentinel = useRef<HTMLDivElement | null>(null);
  const lastCount = useRef(count);
  const waiting = useRef(false);

  // колбэки меняются на каждом рендере — держим их в ref
  const loadRef = useRef(onLoad);
  loadRef.current = onLoad;
  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  const tryLoad = () => {
    const node = sentinel.current;
    if (!node || disabledRef.current || waiting.current) return;

    const rect = node.getBoundingClientRect();
    if (rect.top > window.innerHeight + MARGIN) return;

    waiting.current = true;
    loadRef.current();
  };

  // после каждой загрузки: если маячок всё ещё виден — грузим следующую порцию
  useEffect(() => {
    if (count !== lastCount.current) {
      lastCount.current = count;
      waiting.current = false;
    }
    if (!disabled) tryLoad();
  }, [count, disabled]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;

    const observer = new IntersectionObserver(() => tryLoad(), {
      rootMargin: `${MARGIN}px 0px`,
    });
    observer.observe(node);

    const onScroll = () => tryLoad();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (disabled) return null;

  return <div ref={sentinel} style={{ height: 1 }} aria-hidden="true" />;
};

export default InfiniteScroll;
