import styled from "styled-components";
import { IframeProps } from "../../components/FilmPage/Iframe.types";
import { ImgWrap, ImgWrapper, Img } from "../../components/Card";

export const Wrapper = styled.div`
  z-index: 1;
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