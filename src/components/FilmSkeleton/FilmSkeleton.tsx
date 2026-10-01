"use client";

/**
 * Скелетон страницы фильма (десктоп).
 *
 * Размеры повторяют реальную вёрстку из FilmPage.styles.ts:
 *  - фон-обложка: абсолютный блок 780px с отступом сверху -120px;
 *  - герой: флекс, отступ сверху 40px, зазор 48px;
 *  - постер: 300px (220px уже 1150px);
 *  - заголовок 56px, мета-строка, кнопки 46px, описание 4 строки шириной 620px.
 *
 * Анимация — бегущий блик, как у Netflix и YouTube: он читается как «данные
 * едут» лучше, чем мигание прозрачностью.
 */

import React from "react";
import styled, { css, keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -500px 0; }
  100% { background-position: 500px 0; }
`;

// css`` обязателен: без него styled-components v5+ не принимает keyframes
// внутри обычной строки и падает с ошибкой "interpolating a keyframe declaration"
const block = css`
  background-color: #262626;
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 45%,
    rgba(255, 255, 255, 0) 90%
  );
  background-size: 500px 100%;
  background-repeat: no-repeat;
  animation: ${shimmer} 1.5s linear infinite;
  border-radius: 8px;
`;

const Page = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1220px;
  margin: 0 auto;
  padding: 0 20px 80px;
`;

/** Фон-обложка: в реальной вёрстке это absolute-слой высотой 780px */
const Backdrop = styled.div`
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 780px;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(180deg, #2e2e2e 0%, #1d1d1d 55%, #0d0d0d 100%);

  @media (max-width: 850px) {
    display: none;
  }
`;

const Hero = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 48px;
  padding-top: 104px;
  margin-bottom: 36px;

  @media (max-width: 1150px) {
    padding-top: 72px;
  }
`;

const HeroText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 760px;
  min-width: 0;
  flex: 1;
`;

const Title = styled.div`
  ${block};
  height: 58px;
  width: 72%;
`;

const Slogan = styled.div`
  ${block};
  height: 20px;
  width: 45%;
  margin-top: 14px;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
`;

const Chip = styled.div<{ $w?: number }>`
  ${block};
  height: 22px;
  width: ${(props) => props.$w || 84}px;
  border-radius: 6px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.div<{ $w?: number }>`
  ${block};
  height: 46px;
  width: ${(props) => props.$w || 168}px;
`;

const Description = styled.div`
  max-width: 620px;
  width: 100%;
  margin-top: 20px;
`;

const Line = styled.div<{ $w?: string }>`
  ${block};
  height: 13px;
  width: ${(props) => props.$w || "100%"};
  border-radius: 5px;
  margin-top: 11px;
`;

const Poster = styled.div`
  ${block};
  flex: 0 0 300px;
  height: 450px;
  border-radius: 12px;
  align-self: flex-start;

  @media (max-width: 1150px) {
    flex: 0 0 220px;
    height: 330px;
  }
`;

const Section = styled.div`
  margin-top: 84px;
`;

const SectionTitle = styled.div`
  ${block};
  height: 28px;
  width: 200px;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  margin-top: 24px;

  @media (max-width: 1150px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const CardPoster = styled.div`
  ${block};
  width: 100%;
  padding-bottom: 150%;
  border-radius: 12px;
`;

const FilmSkeleton: React.FC = () => (
  <Page aria-busy="true" aria-label="Загрузка страницы фильма">
    <Backdrop />
    <Hero>
      <HeroText>
        <Title />
        <Slogan />
        <Meta>
          <Chip $w={72} />
          <Chip $w={96} />
          <Chip $w={64} />
          <Chip $w={110} />
        </Meta>
        <Buttons>
          <Button $w={180} />
          <Button $w={150} />
        </Buttons>
        <Description>
          <Line />
          <Line $w="94%" />
          <Line $w="88%" />
          <Line $w="52%" />
        </Description>
      </HeroText>
      <Poster />
    </Hero>
    <Section>
      <SectionTitle />
      <Cards>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item}>
            <CardPoster />
            <Line $w="78%" />
            <Line $w="38%" />
          </div>
        ))}
      </Cards>
    </Section>
  </Page>
);

export default FilmSkeleton;
