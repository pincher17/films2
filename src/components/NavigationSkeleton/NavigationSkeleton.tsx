'use client';

import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import FilmSkeleton from '../FilmSkeleton/FilmSkeleton';

/**
 * Скелетон следующей страницы сразу по клику.
 *
 * Проблема: при медленной сети между кликом по подсказке поиска и началом
 * перехода проходит несколько секунд. Список подсказок к этому моменту уже
 * закрыт, на экране ничего не меняется — кажется, что клик не сработал.
 *
 * Решение: по событию «собираемся перейти» показываем тот же скелетон, что и
 * сама страница фильма (FilmSkeleton). Дальше маршрут меняется, Next рисует
 * свой loading.tsx — а там ровно этот же компонент, поэтому картинка не
 * прыгает. Показываем с задержкой: если переход успел за 130 мс, скелетон не
 * мелькнёт вовсе.
 */

export const NAV_START_EVENT = 'fh:nav-start';
/** Страница фильма сообщает, что данные пришли и можно показывать содержимое */
export const PAGE_READY_EVENT = 'fh:page-ready';

/** Задержка перед показом: быстрый переход не должен мигать скелетоном */
const SHOW_AFTER_MS = 130;
/** Страховка: если переход не состоялся, не держим скелетон вечно */
const GIVE_UP_MS = 15000;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  /*
   * Слой 4, а не «поверх всего»: шапка на сайте fixed с z-index 5 и должна
   * оставаться видимой. Скелетон при этом отсчитывается от верха окна ровно
   * так же, как в настоящей странице, поэтому в момент перехода ничего не
   * прыгает — об этом и была речь.
   */
  z-index: 4;
  background: #0b0b0b;
  overflow: hidden;
`;

const NavigationSkeleton: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  /* Именно строка, а не объект: useSearchParams может возвращать новую ссылку
     на каждом рендере, и эффект сброса гасил только что показанный скелетон. */
  const searchKey = searchParams?.toString() ?? '';
  const [visible, setVisible] = React.useState(false);
  const showTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const giveUpTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = React.useCallback(() => {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (giveUpTimer.current) clearTimeout(giveUpTimer.current);
    showTimer.current = null;
    giveUpTimer.current = null;
  }, []);

  React.useEffect(() => {
    const onStart = () => {
      clearTimers();
      showTimer.current = setTimeout(() => setVisible(true), SHOW_AFTER_MS);
      giveUpTimer.current = setTimeout(() => setVisible(false), GIVE_UP_MS);
    };
    const onReady = () => {
      clearTimers();
      setVisible(false);
    };

    window.addEventListener(NAV_START_EVENT, onStart);
    window.addEventListener(PAGE_READY_EVENT, onReady);
    return () => {
      window.removeEventListener(NAV_START_EVENT, onStart);
      window.removeEventListener(PAGE_READY_EVENT, onReady);
      clearTimers();
    };
  }, [clearTimers]);

  /*
   * Маршрут сменился. Для страницы фильма скелетон НЕ снимаем: иначе он
   * исчезнет, а на его месте появится второй такой же из loading.tsx — блик
   * начнёт бежать заново, и это видно как мигание. Ждём PAGE_READY_EVENT.
   * Для любых других маршрутов убираем сразу.
   */
  React.useEffect(() => {
    if (pathname.startsWith('/film/')) return;
    clearTimers();
    setVisible(false);
  }, [pathname, searchKey, clearTimers]);

  /*
   * Пока скелетон на экране, страницу под ним прокручивать нельзя.
   * Блокируем и html, и body: на телефоне прокрутка живёт на корневом
   * элементе, и одного body недостаточно — страница продолжала ехать.
   */
  React.useEffect(() => {
    if (!visible) return undefined;
    const root = document.documentElement;
    const body = document.body;
    const prevRoot = root.style.overflow;
    const prevBody = body.style.overflow;
    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      root.style.overflow = prevRoot;
      body.style.overflow = prevBody;
    };
  }, [visible]);

  if (!visible) return null;
  return (
    <Overlay aria-hidden="true" data-fh-nav-skeleton="1">
      <FilmSkeleton />
    </Overlay>
  );
};

export default NavigationSkeleton;
