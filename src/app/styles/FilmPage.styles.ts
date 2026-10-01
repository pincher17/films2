import styled, { keyframes } from "styled-components";
import { IframeProps } from "../../components/FilmPage/Iframe.types";
import { ImgWrap, ImgWrapper, Img } from "../../components/Card";

/** Проявление контента: убирает рывок при подмене скелетона на страницу */
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Wrapper = styled.div`
  animation: ${fadeIn} 0.3s ease;
  position: relative;
  z-index: 1;
`;

/* Большой фон страницы фильма: бэкдроп из TMDB, если его нет — постер в блюре */
/* ───────── Netflix-херо ───────── */
export const Hero = styled.div`
  position: relative;
  padding-top: 40px;
  margin-bottom: 36px;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 48px;

  @media (max-width: 850px) {
    display: none;
  }
`;

export const HeroText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 760px;
  min-width: 0;
`;

/* главная обложка фильма в херо */
export const HeroPoster = styled.div`
  flex: 0 0 300px;
  align-self: flex-start;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.09);
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.7);
  background: #101010;

  img {
    display: block;
    width: 100%;
    height: auto;
  }

  @media (max-width: 1150px) {
    flex: 0 0 220px;
  }
`;

export const HeroTitle = styled.h1`
  font-size: 56px;
  line-height: 1.05;
  font-weight: 800;
  margin: 0 0 14px;
  color: #fff;
  text-shadow: 0 4px 28px rgba(0, 0, 0, 0.75);
`;

export const HeroSlogan = styled.p`
  margin: 0 0 14px;
  font-size: 17px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.62);
  max-width: 620px;
`;

export const HeroMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.82);
  margin-bottom: 20px;
`;

export const HeroScore = styled.span`
  color: #46d369;
  font-weight: 700;
`;

export const HeroDot = styled.span`
  &::before {
    content: "•";
  }
`;

export const HeroButtons = styled.div`
  display: flex;
  gap: 12px;
`;

/* строка деталей под описанием: режиссёр, в ролях, бюджет */
export const HeroFacts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  margin-top: auto;
  padding-top: 22px;
  /* подъём строки деталей от низа херо: больше значение — выше строка */
  margin-bottom: 54px;
  font-size: 14px;
  max-width: 660px;
  color: rgba(255, 255, 255, 0.5);

  b {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
  }
`;

/* теги фильма */
export const HeroTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
  max-width: 660px;
`;

export const HeroTag = styled.span`
  padding: 5px 12px;
  font-size: 12.5px;
  line-height: 1.2;
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.82);
  background: rgba(255, 255, 255, 0.09);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.16);
  }
`;

export const HeroDescription = styled.p<{ $expanded?: boolean }>`
  margin: 20px 0 0;
  max-width: 620px;
  font-size: 16px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.86);
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => (props.$expanded ? "unset" : 4)};
  -webkit-box-orient: vertical;
  overflow: ${(props) => (props.$expanded ? "visible" : "hidden")};
`;

/* кнопка «Читать полностью / Свернуть» — только если текст обрезан */
export const HeroMore = styled.button`
  margin-top: 10px;
  padding: 0;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  transition: color 0.2s ease, border-color 0.2s ease;

  &:hover {
    color: #fff;
    border-color: #fff;
  }
`;

export const HeroButton = styled.button<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 26px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease;
  background: ${(props) => (props.$primary ? "#ffffff" : "rgba(109, 109, 110, 0.7)")};
  color: ${(props) => (props.$primary ? "#000" : "#fff")};

  &:hover {
    background: ${(props) => (props.$primary ? "#e6e6e6" : "rgba(109, 109, 110, 0.45)")};
    transform: translateY(-1px);
  }
`;

/* постер-карточка на десктопе больше не нужен — данные ушли в херо */
export const PosterBlock = styled.div`
  @media (min-width: 851px) {
    display: none;
  }
`;

export const Backdrop = styled.div`
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 780px;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
  background: #000;

  @media (max-width: 850px) {
    display: none;
  }
`;

export const BackdropImage = styled.img<{ $blurred?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 22%;
  filter: ${(props) =>
    props.$blurred
      ? "blur(26px) brightness(0.42) saturate(1.1)"
      : "brightness(0.62) saturate(1.06)"};
  transform: ${(props) => (props.$blurred ? "scale(1.18)" : "none")};
`;

export const BackdropShade = styled.div`
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.74) 0%,
      rgba(0, 0, 0, 0.38) 34%,
      rgba(0, 0, 0, 0.88) 84%,
      #000 100%
    ),
    linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.82) 0%,
      rgba(0, 0, 0, 0.12) 42%,
      rgba(0, 0, 0, 0.62) 100%
    );
`;
export const WrapperInfo = styled.div`
    @media (max-width: 1150px){
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
  }
  @media (max-width: 850px){
    display: initial;
  }
`;
export const WrapperWatchFilm = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  @media (max-width: 1150px){
    display: initial;
    position: initial;
    margin-right: 30px;
    & > div{
        margin-bottom: 40px;
    }
  }
`;
export const Name = styled.h1`
  font-size: 36px;
  font-weight: bolder;
  margin: 0;
  margin-bottom: 20px;
  @media (max-width: 850px){
    /* background: linear-gradient(0deg, rgb(0 0 0 / 85%) 25%, rgb(0 0 0 / 0%) 100%); */
    /* background-color: black; */
    /* position: relative;
    z-index: 5; */
    /* width: 100vw; */
  }
`;
export const Flex = styled.div`
  display: flex;
  @media (max-width: 850px){
    flex-wrap: wrap;
    margin-bottom: 17px;
  }
`;
export const NameTitle = styled.p`
  color: rgba(255, 255, 255, 0.514);
  font-size: 20px;
  margin-bottom: 20px;
  @media (max-width: 850px){
    margin-bottom: 11px;
  }
`;
export const TextValue = styled.p`
  font-size: 20px;
  padding: 0 0 7px 0;
`;
export const ValueTextSpan = styled.span`
  font-size: 20px;
  padding: 0 0 7px 0;
`;
export const MarginTopTitle = styled(NameTitle)`
  margin-top: -8px;
`;
export const MarginTopValue = styled(TextValue)`
  margin-top: -8px;
`;
/* export const Img = styled.div`
  margin-right: 5px;
`; */
export const ImgWrapperFilm = styled(ImgWrapper)`
  width: 360px;
  margin-right: 5px;
`;
export const ImgWrapFilm = styled(ImgWrap)`
  height: 533px;
`;
export const ImgMain = styled(Img)`
  border-radius: 0;
`;

export const PositionAbsolute = styled.div`
  position: absolute;
`;
export const Film = styled.div`
  position: absolute !important;
  width: 70% !important;
  height: 100% !important;
`;
export const WrapperIframe = styled.div`
  width: 100%;
  height: 533px;
  margin-top: -15px;
`;
export const iframe = styled.div`
  position: absolute !important;
  width: 100% !important;
  height: 100% !important;
`;
export const TitleDescription = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-top: 80px;
`;
export const Description = styled.p`
  margin-top: 15px;
  font-size: 18px;
  margin-bottom: 50px;
  @media (max-width: 1150px){
    height: 249px;
    overflow-y: scroll;
    width: 100%;
  }
`;
export const SwiperWrapperSimilar = styled.div`
   @media (max-width: 1150px){
    /* margin-top: 565px; */
  }
`;

export const Strong = styled.strong`
  margin-left: 10px;
  @media (max-width: 850px){
    position: relative;
    margin-left: 0px;
    padding-bottom: 10px;
    z-index: 3;
    color: #666666;
  }
`;

export const Iframe = styled.iframe<IframeProps>`
 width: 100% !important;
 height: 100% !important;
 @media (min-width: 1500px){
  width: 100% !important;
  height: 100% !important;
  }
  @media (max-width: 1300px){
  width: 107% !important;
  height: 100% !important;
  }
 @media (max-width: 1150px){
  height: 500px !important;
  width: 220% !important;
  margin-top: 20px;
  }
  @media (max-width: 1030px){
  height: 500px !important;
  width: 220% !important;
  }
`

export const TrailerWrapper = styled.div`
  height: 0px;
  padding-bottom: 56.2%;
  position: relative;
  & > iframe{
    width: 100%;
    height: 100%;
    position: absolute;
  }
`;

/* ───────── Ряд актёров ───────── */
export const ActorsSection = styled.section`
  margin-top: 14px;
  margin-bottom: 10px;
`;

export const ActorsHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`;

export const ActorsTitle = styled.h2`
  font-size: 26px;
  font-weight: 700;
  margin: 0;
`;

export const ActorsArrows = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActorsArrow = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #fff;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.22);
  }
`;

export const ActorsRow = styled.div`
  display: flex;
  gap: 22px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-bottom: 6px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ActorCard = styled.div`
  flex: 0 0 132px;
  width: 132px;
  text-align: center;
`;

export const ActorPhoto = styled.div`
  width: 132px;
  height: 132px;
  border-radius: 50%;
  overflow: hidden;
  background: #141414;
  border: 2px solid rgba(255, 255, 255, 0.12);
  margin-bottom: 10px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const ActorName = styled.div`
  font-size: 13.5px;
  color: #fff;
  line-height: 1.3;
  margin-bottom: 4px;
`;

export const ActorRole = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.3;
`;


/* ───────── Галерея кадров ───────── */
export const StillCard = styled.div`
  border-radius: 8px;
  overflow: hidden;
  background: #141414;
  cursor: pointer;
  transition: transform 0.2s ease;

  img {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  &:hover {
    transform: scale(1.03);
  }
`;

/* отдельный оверлей галереи: центрирует кадр (у оверлея трейлера своя вёрстка) */
export const StillOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  cursor: zoom-out;
`;

export const BigStill = styled.img`
  max-width: 88vw;
  max-height: 84vh;
  border-radius: 10px;
  display: block;
`;


/* ───────── Раздел «Детали» ───────── */
export const DetailsSection = styled.section`
  margin-top: 44px;
`;

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 48px;
  margin-top: 18px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailsRow = styled.div`
  display: flex;
  gap: 12px;
  font-size: 15px;
  line-height: 1.45;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
`;

export const DetailsLabel = styled.span`
  flex: 0 0 130px;
  color: rgba(255, 255, 255, 0.45);
`;

export const DetailsValue = styled.span`
  color: rgba(255, 255, 255, 0.92);
`;
