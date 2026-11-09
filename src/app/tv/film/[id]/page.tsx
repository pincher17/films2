"use client";

/**
 * Карточка фильма для телевизора.
 *
 * Сезон и серия выбираются ДО запуска плеера — крупными кнопками, стрелками.
 * Это и есть главное отличие от обычной версии: там выбор живёт внутри чужого
 * плеера, а тут он наш.
 */

import React from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import { TvAction, TvPill, TvPosterCard, TvRow, TvRowScroll } from "@/components/tv/TvParts";

type Season = { number: number; episodes: number };

type Info = {
  name?: string;
  year?: number | null;
  description?: string | null;
  type?: string | null;
  backdrop?: { url?: string } | null;
  poster?: { url?: string } | null;
  genres?: Array<{ name?: string }>;
  seasons?: Season[];
  ratings?: { imdb?: { value?: number } | null; tmdb?: { value?: number } | null };
  videos?: { trailers?: Array<{ url?: string; name?: string }> } | null;
  similarMovies?: Array<{
    id?: number | string;
    name?: string;
    poster?: { url?: string; previewUrl?: string } | null;
  }> | null;
};

const Hero = styled.section<{ $image?: string }>`
  position: relative;
  /* Высота в долях экрана: на 1920×1080 это ~600 px. При прежних 300 px
     кадр 16:9 приходилось обрезать почти в полоску. */
  min-height: min(640px, 60vh);
  /* Сквозная обложка: выходим за поля страницы, а текст ставим ровно по тому
     же краю, что и разделы ниже — тогда ничего не «уезжает» */
  margin: 0 calc(-1 * var(--tv-pad));
  padding: 56px var(--tv-pad);
  box-sizing: border-box;
  background:
    /* мягкий переход вниз, чтобы обложка не обрывалась резкой полосой */
    linear-gradient(180deg, rgba(11, 11, 11, 0) 55%, rgba(11, 11, 11, 0.9) 100%),
    linear-gradient(90deg, rgba(11, 11, 11, 0.97) 0%, rgba(11, 11, 11, 0.72) 48%, rgba(11, 11, 11, 0.15) 100%),
    ${(props) =>
      props.$image ? `url(${props.$image}) center 35% / cover no-repeat` : "#141414"};
  display: flex;
  flex-direction: column;
  justify-content: center;

  h1 {
    margin: 0 0 12px;
    font-size: 56px;
    line-height: 1.08;
    max-width: 1100px;
  }

  .meta {
    color: #bdbdbd;
    font-size: 19px;
    margin-bottom: 20px;
  }

  p {
    max-width: 820px;
    color: #d0d0d0;
    font-size: 19px;
    line-height: 1.5;
    margin: 0 0 26px;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const Section = styled.section`
  margin-top: 32px;

  h2 {
    font-size: 22px;
    margin: 0 0 14px;
  }
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const PlayerBox = styled.div`
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 100;
  display: flex;
  flex-direction: column;

  iframe {
    flex: 1;
    width: 100%;
    border: 0;
  }
`;

const PlayerBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  /* Кнопка не в самом углу: на телевизоре курсор крупный, в угол попасть
     сложно, поэтому оставляем заметный отступ */
  padding: 18px 48px;
  background: #0b0b0b;

  span {
    color: #9a9a9a;
    font-size: 16px;
  }
`;

const EpisodeBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 12px 48px 18px;
  background: #0b0b0b;

  .label {
    color: #d0d0d0;
    font-size: 17px;
    min-width: 190px;
    text-align: center;
  }
`;

const Loading = styled.div`
  padding: 80px 0;
  color: #9a9a9a;
  font-size: 20px;
`;

export default function TvFilmPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const filmId = String(params?.id || "");

  const [info, setInfo] = React.useState<Info | null>(null);
  const [season, setSeason] = React.useState<number>(1);
  const [episode, setEpisode] = React.useState<number>(1);
  const [player, setPlayer] = React.useState<string | null>(null);
  const [trailer, setTrailer] = React.useState<string | null>(null);

  const seasons = info?.seasons || [];
  const isSeries = seasons.length > 0;

  React.useEffect(() => {
    if (!filmId) return;
    let cancelled = false;

    (async () => {
      try {
        const [filmResponse, positionResponse] = await Promise.all([
          fetch(`/api/film?id=${encodeURIComponent(filmId)}`, { cache: "no-store" }),
          fetch(`/api/position?filmId=${encodeURIComponent(filmId)}&latest=1`, {
            cache: "no-store",
          }).catch(() => null),
        ]);

        const filmData = await filmResponse.json();
        const filmInfo: Info | null = filmData?.info || null;
        if (cancelled) return;
        setInfo(filmInfo);

        /* Если человек уже смотрел — открываем ту серию, на которой остановился */
        const position = positionResponse ? (await positionResponse.json())?.position : null;
        if (position?.season) setSeason(Number(position.season));
        if (position?.episode) setEpisode(Number(position.episode));
      } catch {
        if (!cancelled) setInfo(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [filmId]);

  const episodesInSeason = seasons.find((item) => item.number === season)?.episodes || 0;
  const maxEpisode = episodesInSeason || 1;

  const startWatching = React.useCallback(async (episodeOverride?: number) => {
    const activeSeason = isSeries ? season : 0;
    const activeEpisode = isSeries
      ? typeof episodeOverride === "number"
        ? episodeOverride
        : episode
      : 0;

    let time = 0;
    try {
      const response = await fetch(
        `/api/position?filmId=${encodeURIComponent(filmId)}&season=${activeSeason}&episode=${activeEpisode}`,
        { cache: "no-store" }
      );
      if (response.ok) {
        const position = (await response.json())?.position;
        const seconds = Number(position?.seconds) || 0;
        const duration = Number(position?.duration) || 0;
        if (seconds > 45 && (!duration || seconds < duration - 90)) time = seconds;
      }
    } catch {
      undefined;
    }

    const kind = String(filmId).startsWith("tt") ? "imdb" : "kp";
    const params2 = new URLSearchParams();
    if (isSeries) {
      params2.set("season", String(activeSeason));
      params2.set("episode", String(activeEpisode));
    }
    if (time) params2.set("time", String(Math.floor(time)));

    const suffix = params2.toString() ? `?${params2.toString()}` : "";
    setPlayer(`https://api.ortified.ws/embed/${kind}/${filmId}${suffix}`);
  }, [filmId, isSeries, season, episode]);

  if (!info) return <Loading>Загружаю фильм…</Loading>;

  const genres = (info.genres || []).map((genre) => genre.name).filter(Boolean).join(", ");
  const rating = info.ratings?.imdb?.value || info.ratings?.tmdb?.value || null;

  return (
    <main>
      <Hero $image={info.backdrop?.url || info.poster?.url || undefined}>
        <h1>{info.name}</h1>
        <div className="meta">
          {[info.year, genres, rating ? `★ ${rating}` : null].filter(Boolean).join(" · ")}
        </div>
        {info.description ? <p>{info.description}</p> : null}
        <Row data-tv-row>
          <TvAction $primary data-tv-focus onClick={() => startWatching()}>
            ▶ Смотреть{isSeries ? ` — сезон ${season}, серия ${episode}` : ""}
          </TvAction>
          {info.videos?.trailers?.[0]?.url ? (
            <TvAction data-tv-focus onClick={() => setTrailer(String(info.videos!.trailers![0].url))}>
              ▶ Трейлер
            </TvAction>
          ) : null}
          <TvAction data-tv-focus onClick={() => router.push("/tv")}>
            Назад
          </TvAction>
        </Row>
      </Hero>

      {isSeries ? (
        <>
          <Section>
            <h2>Сезон</h2>
            <Row data-tv-row>
              {seasons.map((item) => (
                <TvPill
                  key={item.number}
                  $active={item.number === season}
                  data-tv-focus
                  onClick={() => {
                    setSeason(item.number);
                    setEpisode(1);
                  }}
                >
                  {item.number}
                </TvPill>
              ))}
            </Row>
          </Section>

          <Section>
            <h2>Серия</h2>
            <Row data-tv-row>
              {Array.from(
                { length: seasons.find((item) => item.number === season)?.episodes || 0 },
                (_, index) => index + 1
              ).map((number) => (
                <TvPill
                  key={number}
                  $active={number === episode}
                  data-tv-focus
                  onClick={() => setEpisode(number)}
                >
                  {number}
                </TvPill>
              ))}
            </Row>
          </Section>
        </>
      ) : null}

      {trailer ? (
        <PlayerBox data-tv-scope>
          <PlayerBar data-tv-row>
            <span>Трейлер · {info.name}</span>
            <TvAction data-tv-focus onClick={() => setTrailer(null)}>
              Закрыть
            </TvAction>
          </PlayerBar>
          <iframe
            src={trailer}
            allowFullScreen
            referrerPolicy="origin"
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups"
          />
        </PlayerBox>
      ) : null}

      {info.similarMovies?.length ? (
        <TvRow style={{ marginTop: 40 }}>
          <h2>{isSeries ? "Похожие" : "Похожие фильмы"}</h2>
          <TvRowScroll data-tv-row>
            {info.similarMovies
              .filter((item) => item?.id && item?.name)
              .slice(0, 20)
              .map((item) => (
                <TvPosterCard
                  key={String(item.id)}
                  href={`/tv/film/${item.id}`}
                  poster={item.poster?.previewUrl || item.poster?.url}
                  name={String(item.name)}
                />
              ))}
          </TvRowScroll>
        </TvRow>
      ) : null}

      {player ? (
        <PlayerBox data-tv-scope>
          <PlayerBar data-tv-row>
            <span>
              {info.name}
              {isSeries ? ` · сезон ${season}, серия ${episode}` : ""}
            </span>
            <TvAction data-tv-focus onClick={() => setPlayer(null)}>
              Закрыть
            </TvAction>
          </PlayerBar>
          <iframe
            src={player}
            allowFullScreen
            referrerPolicy="origin"
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups"
          />

          {isSeries ? (
            <EpisodeBar data-tv-row>
              <TvAction
                data-tv-focus
                onClick={() => {
                  const previous = Math.max(1, episode - 1);
                  setEpisode(previous);
                  setPlayer(null);
                  window.setTimeout(() => startWatching(previous), 60);
                }}
              >
                ‹ Серия {Math.max(1, episode - 1)}
              </TvAction>
              <span className="label">
                Сезон {season} · серия {episode}
              </span>
              <TvAction
                data-tv-focus
                onClick={() => {
                  const next = Math.min(maxEpisode, episode + 1);
                  setEpisode(next);
                  setPlayer(null);
                  window.setTimeout(() => startWatching(next), 60);
                }}
              >
                Серия {Math.min(maxEpisode, episode + 1)} ›
              </TvAction>
            </EpisodeBar>
          ) : null}
        </PlayerBox>
      ) : null}
    </main>
  );
}
