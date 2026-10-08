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
  background-color: #141414;
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.045) 45%,
    rgba(255, 255, 255, 0) 90%
  );
  background-size: 500px 100%;
  background-repeat: no-repeat;
  animation: ${shimmer} 1.5s linear infinite;
  border-radius: 8px;
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Page = styled.div`
  animation: ${fadeIn} 0.18s ease;

  /**
   * Ровно как .layout в LayoutFilm.module.css: реальная страница лежит внутри
   * этого контейнера, и без тех же значений скелетон стоит не на своём месте —
   * в частности без отступа 120px сверху контент прижимается к шапке.
   */
  width: 1440px;
  margin: 120px auto 0;
  height: 100%;
  position: relative;
  z-index: 1;

  @media (max-width: 1500px) {
    width: 1250px;
  }

  @media (max-width: 1300px) {
    width: 1050px;
  }

  @media (max-width: 1150px) {
    width: 800px;
  }

  @media (max-width: 850px) {
    width: 100%;
    /* как в FilmPageMobile: Wrapper с отступами 20px */
    padding: 0 20px;
    margin-top: 90px;
  }
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
  background: linear-gradient(180deg, #191919 0%, #111111 55%, #0a0a0a 100%);

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
  // ровно как в FilmPage.styles: Hero — иначе контент стоит не там,
  // где окажется после загрузки, и при подмене происходит рывок
  padding-top: 40px;
  margin-bottom: 36px;
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

/** Плеер: в реальной вёрстке это блок 16:9 сразу после героя (id="fh-player") */
/**
 * Плеер. В реальной вёрстке контейнер (WrapperIframe, 533px) начинается сразу
 * под героем и включает в себя вкладки «Плеер 1 / Плеер 2» и выбор озвучки.
 * В скелетоне вкладок нет, поэтому блок опускаем к тому месту, где начинается
 * само видео, а высоту подрезаем — низ остаётся там же.
 */
const PlayerBlock = styled.div`
  ${block};
  width: 100%;
  height: 470px;
  border-radius: 12px;
  margin-top: 45px;

  @media (max-width: 1150px) {
    height: 370px;
    margin-top: 35px;
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
  @media (max-width: 850px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CardPoster = styled.div`
  ${block};
  width: 100%;
  padding-bottom: 150%;
  border-radius: 12px;
`;

/** Обёртки: на телефоне реальная страница другая, значит и скелетон другой */
const DesktopOnly = styled.div`
  @media (max-width: 850px) {
    display: none;
  }
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: 850px) {
    display: block;
  }
`;

/** Фон-градиент: в мобильной вёрстке это absolute-слой высотой 750px */
const MobileBackdrop = styled.div`
  position: absolute;
  top: -80px;
  left: 0;
  width: 100%;
  height: 750px;
  z-index: -1;
  background: linear-gradient(0deg, #0a0a0a 25%, rgba(10, 10, 10, 0) 100%);
`;

/** Постер: ImgWrapperFilmMobile — 280px по центру, ImgWrapFilmMobile — 414.77px */
const MobilePoster = styled.div`
  ${block};
  width: 280px;
  height: 414.77px;
  margin: 0 auto;
`;

const MobileTitle = styled.div`
  ${block};
  height: 34px;
  width: 72%;
  margin: 20px auto 0;
`;

/** ButtonWatch: красная кнопка с отступами 25px сверху и снизу */
const MobileButton = styled.div`
  ${block};
  height: 72px;
  width: 100%;
  margin-top: 24px;
  border-radius: 6px;
`;

const MobileTrailer = styled.div`
  ${block};
  height: 52px;
  width: 100%;
  margin-top: 12px;
  border-radius: 6px;
`;

/** Плашка «вы остановились здесь» */
const MobileHint = styled.div`
  ${block};
  height: 70px;
  width: 100%;
  margin-top: 18px;
  border-radius: 10px;
`;

const MobileSectionTitle = styled.div`
  ${block};
  height: 20px;
  width: 34%;
  margin-top: 26px;
`;

const FilmSkeleton: React.FC = () => (
  <Page aria-busy="true" aria-label="Загрузка страницы фильма">
    <DesktopOnly>
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
    <PlayerBlock />
    </DesktopOnly>
    <MobileOnly>
      <MobileBackdrop />
      <MobilePoster />
      <MobileTitle />
      {/* FilmInfoText: метаданные под постером */}
      <Meta>
        <Chip $w={56} />
        <Chip $w={48} />
        <Chip $w={110} />
        <Chip $w={92} />
      </Meta>
      <MobileButton />
      <MobileTrailer />
      <MobileHint />
      <Line $w="86%" />
      <MobileSectionTitle />
      <Description>
        <Line />
        <Line $w="94%" />
        <Line $w="88%" />
        <Line $w="46%" />
      </Description>
    </MobileOnly>
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
