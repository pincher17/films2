import styled from "styled-components";
import { CrossIcon } from "@/app/styles/AllFilmsPage.styles";
import { IframeProps } from "@/components/FilmPage/Iframe.types";

/*
 * Телефон повёрнут: в ландшафте высота экрана — дефицит, поэтому плеер
 * задаётся от неё, а ширина выходит из пропорции 16:9.
 */
const landscape = `@media (max-width: 950px) and (orientation: landscape)`;

export const Wrapper = styled.div`
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  /*
   * 140vw/140vh — задумка для размытого фона на компьютере; на телефоне
   * это вылезало за экран.
   */
  width: 140vw;
  height: 140vh;
  background-color: rgb(0 0 0 / 80%);
  -webkit-backdrop-filter: blur(35px);
  backdrop-filter: blur(35px);
  background: rgb(21 21 21 / 83%);

  @media (max-width: 850px) {
    width: 100%;
    height: 100%;
    /* трейлер — по центру экрана, как и плеер */
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 24px 0;
    box-sizing: border-box;
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

export const Iframe = styled.iframe<IframeProps>`
    width: 70% !important;
    height: 50vh !important;
    top: 7%;
    left: 5px;

    @media (max-width: 850px) {
      display: block;
      width: 100% !important;
      height: auto !important;
      aspect-ratio: 16 / 9;
      top: 0;
      left: 0;
    }

    /* ландшафт: почти вся высота экрана, отсюда и ширина */
    ${landscape} {
      width: auto !important;
      height: 78vh !important;
      max-width: 100%;
      aspect-ratio: 16 / 9;
      margin: 0 auto;
    }
`;
