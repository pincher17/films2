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

    fetch("/api/continue", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : { docs: [] }))
      .then((data) => {
        if (!cancelled) setDocs(Array.isArray(data?.docs) ? data.docs : []);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  if (!docs.length) return null;

  return <SwiperFilms cards={docs} title="Продолжить просмотр" />;
};

export default ContinueWatching;
