import styled from "styled-components";
import { CrossIcon } from "@/app/styles/AllFilmsPage.styles";
import { WrapperIframeMobileProps } from "@/components/MobileWatchFilm";
import { IframeProps } from "@/components/FilmPage/Iframe.types";

export const Wrapper = styled.div`
  position: fixed;
  z-index: 25;
  top: 0;
  left: 0;
  /* 140vw/140vh — задумка для размытого фона на компьютере; на телефоне
     это вылезало за экран, поэтому там размер строго по экрану */
  width: 140vw;
  height: 140vh;
  background-color: rgb(0 0 0 / 80%);
  -webkit-backdrop-filter: blur(35px);
  backdrop-filter: blur(35px);
  background: rgb(21 21 21 / 83%);

  @media (max-width: 850px) {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
`;

export const CrossIconFilm = styled(CrossIcon)`
 right: auto;
 margin-left: 0;
 top: 3%;
    left: 62%;

  /* на телефоне крестик — в правом верхнем углу самого экрана */
  @media (max-width: 850px) {
    top: 14px;
    left: auto;
    right: 14px;
    z-index: 30;
  }
`;

export const WrapperIframeMobile = styled.div<WrapperIframeMobileProps>`
  margin-top: 90px;
  margin-left: 7px;

  /* на телефоне попап занимает экран целиком, без сдвигов */
  @media (max-width: 850px) {
    margin-top: 0;
    margin-left: 0;
    width: 100%;
    padding: 0 12px;
    box-sizing: border-box;
  }
`

export const Iframe = styled.iframe<IframeProps>`
    width: 70% !important;
    height: 62vh !important;
    top: 7%;
    left: 5px;

    /*
     * На телефоне плеер должен занимать всю ширину и держать пропорцию 16:9.
     * Раньше оставались 70% ширины и 62vh — на экране 393px это узкая полоса
     * со сдвигом вправо, из-за чего вёрстка не совпадала с макетом.
     */
    @media (max-width: 850px) {
      display: block;
      width: 100% !important;
      height: auto !important;
      aspect-ratio: 16 / 9;
      top: 0;
      left: 0;
    }
`