"use client";

/**
 * Демо-страница плеера: показывает, как работает свой плеер на hls.js.
 * Все источники ниже — легальные: фильмы Blender Foundation (лицензия CC-BY),
 * тестовые HLS-потоки Mux и Apple, и фильм «Генерал» (1926) из Internet Archive
 * (Public Domain Mark 1.0).
 */

import React, { useState } from "react";
import styled from "styled-components";
import Player, { PlayerSource } from "@/components/Player/Player";
import { MainTag } from "@/app/Main.styles";

const SOURCES: PlayerSource[] = [
  {
    id: "mux-hls",
    name: "Big Buck Bunny",
    year: 2008,
    src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    license: "CC-BY 3.0, Blender Foundation",
    note: "HLS, несколько качеств — переключатель качества в плеере",
  },
  {
    id: "apple-hls",
    name: "Apple HLS пример",
    src: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
    license: "Тестовый поток Apple (fMP4 HLS)",
    note: "Проверка адаптивного битрейта и fMP4",
  },
  {
    id: "bunny-mp4",
    name: "Big Buck Bunny (MP4)",
    year: 2008,
    src: "https://media.w3.org/2010/05/bunny/movie.mp4",
    license: "CC-BY 3.0, Blender Foundation",
    note: "Обычный MP4 — как ведёт себя прогрессивная загрузка",
  },
  {
    id: "sintel-trailer",
    name: "Sintel — трейлер 720p",
    year: 2010,
    src: "https://download.blender.org/durian/trailer/sintel_trailer-720p.mp4",
    license: "CC-BY 3.0, Blender Foundation",
    note: "Файл прямо с сервера Blender",
  },
  {
    id: "general-1926",
    name: "Генерал",
    year: 1926,
    src: "https://archive.org/download/TheGeneral1926/The_General_1926_720p.mp4",
    poster: "https://archive.org/services/img/TheGeneral1926",
    license: "Public Domain Mark 1.0, Internet Archive",
    note: "Фильм из общественного достояния — можно показывать легально",
  },
  {
    id: "w3c-test",
    name: "Тестовое видео W3C",
    src: "https://media.w3.org/2010/05/video/movie_300.mp4",
    license: "Тестовый файл W3C",
    note: "Маленький файл — проверка быстрого старта",
  },
];

const Title = styled.h1`
  font-size: 24px;
  margin: 24px 0 8px;
`;

const Subtitle = styled.p`
  color: #9a9a9a;
  font-size: 14px;
  margin-bottom: 20px;
  max-width: 900px;
  line-height: 1.5;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  align-items: start;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Card = styled.button<{ $active: boolean }>`
  text-align: left;
  background: ${(props) => (props.$active ? "#1d1d1d" : "#121212")};
  border: 1px solid ${(props) => (props.$active ? "#d41515" : "#2a2a2a")};
  color: #fff;
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #555;
  }
`;

const Name = styled.div`
  font-size: 14px;
  margin-bottom: 4px;
`;

const Meta = styled.div`
  font-size: 11px;
  color: #8a8a8a;
  line-height: 1.45;
`;

const PlayerPage = () => {
  const [active, setActive] = useState<PlayerSource>(SOURCES[0]);

  return (
    <MainTag>
      <Title>Плеер — демо</Title>
      <Subtitle>
        Собственный плеер на <b>hls.js</b>: адаптивный битрейт и ручной выбор качества, буфер,
        перемотка, скорость, громкость, полный экран, Picture-in-Picture, горячие клавиши
        (пробел, ←/→, ↑/↓, F, M) и запоминание позиции просмотра. Все источники ниже легальные —
        открытые фильмы Blender (CC-BY), тестовые HLS-потоки Mux/Apple и фильм из общественного
        достояния (Internet Archive, Public Domain Mark).
      </Subtitle>

      <Layout>
        <Player source={active} />

        <List>
          {SOURCES.map((item) => (
            <Card
              key={item.id}
              $active={item.id === active.id}
              onClick={() => setActive(item)}
            >
              <Name>
                {item.name}
                {item.year ? ` (${item.year})` : ""}
              </Name>
              <Meta>
                {item.license}
                {item.note ? <><br />{item.note}</> : null}
              </Meta>
            </Card>
          ))}
        </List>
      </Layout>
    </MainTag>
  );
};

export default PlayerPage;
