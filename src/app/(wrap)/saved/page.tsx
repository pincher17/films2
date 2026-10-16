"use client";

import React from "react";
import { MainTag } from "@/app/Main.styles";
import Cards from "@/components/Cards/Cards";
import { Chip, Chips, Empty, Header, Row, Sort, Wrapper } from "../../styles/SavedPage.styles";

/**
 * Страница «Сохранённое».
 *
 * Сортировка и фильтр сделаны на клиенте: список небольшой, поэтому
 * переключение мгновенное и без обращения к серверу.
 */

type SavedDoc = {
  id: string | number;
  name: string;
  type?: string;
  year?: number | null;
  rating?: { kp?: number } | null;
  savedAt?: string | null;
};

const TYPES = [
  { key: "all", label: "Все" },
  { key: "movie", label: "Фильмы" },
  { key: "tv", label: "Сериалы" },
  { key: "cartoon", label: "Мультфильмы" },
];

const SORTS = [
  { key: "date", label: "Сначала новые" },
  { key: "rating", label: "По рейтингу" },
  { key: "year", label: "По году" },
];

export default function SavedPage() {
  const [docs, setDocs] = React.useState<SavedDoc[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [type, setType] = React.useState("all");
  const [sort, setSort] = React.useState("date");

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const response = await fetch("/api/saved", { cache: "no-store" });
        const data = await response.json();
        if (alive) setDocs(Array.isArray(data?.docs) ? data.docs : []);
      } catch {
        if (alive) setDocs([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const shown = React.useMemo(() => {
    let list = [...docs];

    if (type !== "all") {
      list = list.filter((item) => String(item.type || "").toLowerCase().includes(type));
    }

    list.sort((a, b) => {
      if (sort === "rating") return (b.rating?.kp || 0) - (a.rating?.kp || 0);
      if (sort === "year") return (b.year || 0) - (a.year || 0);
      // по умолчанию — свежие сохранения сверху
      return new Date(b.savedAt || 0).getTime() - new Date(a.savedAt || 0).getTime();
    });

    return list;
  }, [docs, type, sort]);

  return (
    <MainTag>
      <Wrapper>
        <Header>
          <h1>Сохранённое</h1>
          {docs.length ? <span>{docs.length}</span> : null}
        </Header>

        <Row>
          <Chips>
            {TYPES.map((item) => (
              <Chip
                key={item.key}
                type="button"
                $active={type === item.key}
                onClick={() => setType(item.key)}
              >
                {item.label}
              </Chip>
            ))}
          </Chips>

          <Sort value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Сортировка">
            {SORTS.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </Sort>
        </Row>

        {!loading && !shown.length ? (
          <Empty>
            <h2>Пока ничего не сохранено</h2>
            <p>
              Нажмите закладку на карточке фильма или кнопку «Сохранить» на его странице —
              и он появится здесь. Список виден и без входа в аккаунт.
            </p>
          </Empty>
        ) : (
          <Cards cards={shown} />
        )}
      </Wrapper>
    </MainTag>
  );
}
