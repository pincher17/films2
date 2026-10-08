"use client";

/**
 * Ряд «Продолжить просмотр» на главной.
 *
 * Данные приходят из нашего API: это записи пользователя (в том числе
 * анонимного — профиль в cookie). Показываем первым рядом, потому что
 * продолжить важнее, чем начать новое. Если начатого нет — ряда нет вовсе.
 *
 * Подпись на карточке не нужна: раз она в этом ряду, всё понятно.
 * Полоски прогресса тоже нет — для встроенного плеера позиция недоступна,
 * и рисовать выдуманный процент нельзя.
 */

import React from "react";
import SwiperFilms from "../SwiperFilms/SwiperFilms";

const ContinueWatching: React.FC = () => {
  const [docs, setDocs] = React.useState<any[]>([]);

  React.useEffect(() => {
    let cancelled = false;

    const load = () => {
      fetch("/api/continue", { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : { docs: [] }))
        .then((data) => {
          if (!cancelled) setDocs(Array.isArray(data?.docs) ? data.docs : []);
        })
        .catch(() => undefined);
    };

    load();

    /*
     * Ряд запрашивался один раз при открытии главной, поэтому после просмотра
     * фильма на главной оставались старые данные. Обновляем, когда:
     *   • вкладка снова стала видимой (вернулись с страницы фильма);
     *   • окно получило фокус;
     *   • нажали на логотип — он шлёт fh:refresh-home.
     */
    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };

    window.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", load);
    window.addEventListener("fh:refresh-home", load);

    return () => {
      cancelled = true;
      window.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", load);
      window.removeEventListener("fh:refresh-home", load);
    };
  }, []);

  const remove = (card: any) => {
    // сразу убираем с экрана, чтобы не ждать ответа сервера
    setDocs((prev) => prev.filter((item) => item.id !== card.id));
    fetch(`/api/continue?filmId=${card.id}`, { method: "DELETE" }).catch(() => undefined);
  };

  if (!docs.length) return null;

  return <SwiperFilms cards={docs} title="Продолжить просмотр" onRemove={remove} />;
};

export default ContinueWatching;
