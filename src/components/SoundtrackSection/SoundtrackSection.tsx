"use client";

/**
 * «Музыка в фильме»: альбом саундтрека и список треков.
 *
 * Данные приходят с нашего сервера: там связь «фильм → альбом» берётся из
 * Wikidata по кинопоисковому id, а треклист — из MusicBrainz. Если данных нет,
 * секция не показывается вовсе: пустой блок хуже, чем его отсутствие.
 */

import React from "react";
import styled from "styled-components";

type Track = { number: number; title: string; artist?: string; length: number | null };

/**
 * В подборках iTunes и Deezer названия идут с хвостом вида
 * «Web Letter Days (from "Spider-Man: Brand New Day")». Для списка это шум:
 * строка обрезается многоточием, а полезной информации хвост не несёт.
 * Полное название остаётся в подсказке при наведении.
 */
const cleanTrackTitle = (title: string) => {
  const cleaned = title
    .replace(/\s*\((?:from|из|feat\.?)\s[^)]*\)\s*$/i, "")
    .replace(/\s*[-–—]\s*(?:from|из)\s.*$/i, "")
    .trim();
  return cleaned || title;
};

type Soundtrack = {
  album?: string;
  artist?: string;
  year?: string;
  source?: string;
  cover?: string;
  tracks: Track[];
};

type Props = {
  kpId: string | number;
  title?: string;
  originalTitle?: string;
  year?: string | number;
};

const VISIBLE = 8;

const Section = styled.section`
  margin: 46px 0 10px;

  @media (max-width: 850px) {
    margin: 34px 0 6px;
  }
`;

const Heading = styled.h2`
  /* как у заголовка «Детали» на той же странице */
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 18px;

  /* как остальные заголовки секций на телефоне */
  @media (max-width: 850px) {
    font-size: 21px;
    margin-bottom: 14px;
  }
`;

const AlbumRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 14px;

  @media (max-width: 850px) {
    gap: 12px;
  }
`;

const Cover = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 10px;
  flex-shrink: 0;
  background: #1c1c1c;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 850px) {
    width: 72px;
    height: 72px;
  }
`;

const AlbumName = styled.div`
  font-size: 19px;
  font-weight: 600;
  color: #fff;

  /* длинное название альбома — максимум две строки */
  @media (max-width: 850px) {
    font-size: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const AlbumMeta = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
`;

const List = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2px 34px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Row = styled.li`
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 7px 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const Number = styled.span`
  min-width: 20px;
  text-align: right;
  color: rgba(255, 255, 255, 0.32);
  font-variant-numeric: tabular-nums;
`;

const TrackName = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/**
 * Исполнитель трека показывается только если он отличается от исполнителя
 * альбома: иначе в списке из 16 треков имя композитора повторялось бы 16 раз.
 */
const TrackArtist = styled.span`
  color: rgba(255, 255, 255, 0.42);
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 190px;
`;

const Length = styled.span`
  color: rgba(255, 255, 255, 0.45);
  font-variant-numeric: tabular-nums;
`;

const Toggle = styled.button`
  @media (max-width: 850px) {
    width: 100%;
    padding: 12px 0;
    text-align: center;
  }

  margin-top: 16px;
  padding: 9px 18px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: transparent;
  color: #fff;
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const format = (seconds: number | null) => {
  if (!seconds || seconds <= 0) return "";
  const minutes = Math.floor(seconds / 60);
  const rest = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${rest}`;
};

const SoundtrackSection: React.FC<Props> = ({ kpId, title, originalTitle, year }) => {
  const [data, setData] = React.useState<Soundtrack | null>(null);
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    if (!kpId) return;
    let cancelled = false;

    const query = new URLSearchParams({
      kpId: String(kpId),
      title: title || "",
      originalTitle: originalTitle || "",
      year: String(year || ""),
    });

    fetch(`/api/soundtrack?${query.toString()}`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : { soundtrack: null }))
      .then((result) => {
        if (!cancelled && result?.soundtrack?.tracks?.length) setData(result.soundtrack);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [kpId, title, originalTitle, year]);

  if (!data) return null;

  const tracks = expanded ? data.tracks : data.tracks.slice(0, VISIBLE);
  const hidden = data.tracks.length - tracks.length;

  return (
    <Section>
      <Heading>Музыка в фильме</Heading>

      <AlbumRow>
        {data.cover ? (
          <Cover>
            <img src={data.cover} alt="" loading="lazy" />
          </Cover>
        ) : null}
        <div>
          <AlbumName>{data.album || "Саундтрек"}</AlbumName>
          <AlbumMeta>
            {[
              data.tracks.some((track) => track.artist && track.artist !== data.artist)
                ? "разные исполнители"
                : data.artist,
              data.year,
              data.tracks.length ? `${data.tracks.length} треков` : null,
            ]
              .filter(Boolean)
              .join(" • ")}
          </AlbumMeta>
        </div>
      </AlbumRow>

      <List>
        {tracks.map((track) => (
          <Row key={`${track.number}-${track.title}`}>
            <Number>{track.number}</Number>
            <TrackName title={track.title}>{cleanTrackTitle(track.title)}</TrackName>
            {track.artist && track.artist !== data.artist ? (
              <TrackArtist title={track.artist}>{track.artist}</TrackArtist>
            ) : null}
            <Length>{format(track.length)}</Length>
          </Row>
        ))}
      </List>

      {hidden > 0 || expanded ? (
        <Toggle type="button" onClick={() => setExpanded((value) => !value)}>
          {expanded ? "Свернуть" : `Показать все ${data.tracks.length}`}
        </Toggle>
      ) : null}
    </Section>
  );
};

export default SoundtrackSection;
