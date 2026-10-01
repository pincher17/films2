import styled from "styled-components";
import { IframeProps } from "../../components/FilmPage/Iframe.types";
import { ImgWrap, ImgWrapper, Img } from "../../components/Card";

export const Wrapper = styled.div`
  position: relative;
  z-index: 1;
`;

/* Большой фон страницы фильма: бэкдроп из TMDB, если его нет — постер в блюре */
/* ───────── Netflix-херо ───────── */
export const Hero = styled.div`
  position: relative;
  padding-top: 40px;
  margin-bottom: 28px;
  max-width: 780px;

  @media (max-width: 850px) {
    display: none;
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