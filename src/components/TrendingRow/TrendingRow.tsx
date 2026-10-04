"use client";

/**
 * Ряд трендов: то, что смотрят сейчас (TMDB, окна «сутки» и «неделя»).
 * Отличие от подборки по рейтингу — список живой, меняется сам.
 */

import React from "react";
import SwiperFilms from "../SwiperFilms/SwiperFilms";

type Props = { title: string; window?: "day" | "week" };

const TrendingRow: React.FC<Props> = ({ title, window = "week" }) => {
  const [docs, setDocs] = React.useState<any[]>([]);

  React.useEffect(() => {
    let cancelled = false;

    fetch(`/api/catalog?task=trending&window=${window}&limit=25`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : { docs: [] }))
      .then((data) => {
        if (!cancelled) setDocs(Array.isArray(data?.docs) ? data.docs : []);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [window]);

  if (!docs.length) return null;

  return <SwiperFilms cards={docs} title={title} />;
};

export default TrendingRow;
