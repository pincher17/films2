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
  const countRef = useRef(count);
  countRef.current = count;
  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  const tryLoad = () => {
    const node = sentinel.current;
    if (!node || disabledRef.current || waiting.current) {
      if (waiting.current) console.log("[fh] лента: пропуск — запрос уже в полёте");
      return;
    }

    const rect = node.getBoundingClientRect();
    if (rect.top > window.innerHeight + MARGIN) return;

    waiting.current = true;
    console.log("[fh] лента: запускаю загрузку (карточек на странице:", countRef.current, ")");
    loadRef.current();

    // страховка: если ответ не изменил количество карточек (ошибка, отброшенный
    // запрос), не замираем навсегда — через 12 секунд пробуем снова
    window.setTimeout(() => {
      waiting.current = false;
    }, 12000);
  };

  // после каждой загрузки: если маячок всё ещё виден — грузим следующую порцию
  useEffect(() => {
    if (count !== lastCount.current) {
      lastCount.current = count;
      waiting.current = false;
    }
    if (!disabled) {
      waiting.current = false;
      tryLoad();
    }
  }, [count, disabled]);

  // ВАЖНО: зависимость от disabled. Пока список пуст, компонент возвращает null,
  // маячка нет — и эффект с пустыми зависимостями отработал бы один раз впустую,
  // оставив ленту без слушателей навсегда.
  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;

    console.log("[fh] лента: слушатели подключены");

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
  }, [disabled]);

  if (disabled) return null;

  return <div ref={sentinel} style={{ height: 1 }} aria-hidden="true" />;
};

export default InfiniteScroll;
