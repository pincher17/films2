import styled from "styled-components";
import { Img, ImgWrap, ImgWrapper } from "./Card.styles";


export const Wrapper = styled.div`
  z-index: 1;
  padding-right: 20px;
    padding-left: 20px;
`;

export const Gradient = styled.div`
  width: 100%;
    margin-top: -80px;
    position: absolute;
    left: 0;
    background: rgb(0,0,0);
    background: linear-gradient(0deg, rgb(0 0 0 / 85%) 25%, rgb(0 0 0 / 0%) 100%);
    height: 750px;
    &::after{
    content: "";
    display: block;
    position: absolute;
    z-index: 2;
    left: 0;
    top: 100px;
    height: 100%;
    bottom: -1px;
    right: 0;
    background: linear-gradient(180deg,transparent 50%,transparent 52.63%,rgba(0,0,0,.03) 55.25%,rgba(0,0,0,.08) 57.88%,rgba(0,0,0,.14) 60.51%,rgba(0,0,0,.23) 63.13%,rgba(0,0,0,.33) 65.76%,rgba(0,0,0,.44) 68.39%,rgba(0,0,0,.55) 71.01%,rgba(0,0,0,.66) 73.64%,rgba(0,0,0,.77) 76.27%,rgba(0,0,0,.85) 78.89%,rgba(0,0,0,.92) 81.52%,rgba(0,0,0,.96) 84.15%,rgba(0,0,0,.99) 86.77%,#000 89.4%);
  }
`;

export const BackgroundImage = styled.img`
    width: 100%;
    position: absolute;
    filter: blur(40px);
    z-index: -2;
    height: 500px;
`;

export const WrapperInfo = styled.div`
    @media (max-width: 1150px){
    display: flex;
    /* flex-direction: row-reverse; */
    justify-content: space-between;
    justify-content: center;
  }
`;
export const WrapperWatchFilm = styled.div`
  display: flex;
  position: relative;
  @media (max-width: 1150px){
    display: initial;
    position: initial;
    /* margin-right: 30px; */
    & > div{
        margin-bottom: 40px;
        text-align: center;
    }
  }
  @media (max-width: 850px){
    & > div{
        margin-bottom: 20px;
        text-align: center;
        /* padding-left: 25px; */
        position: relative;
        z-index: 3;
    }
  }
`;
export const Name = styled.div`
  font-size: 36px;
  font-weight: bolder;
`;
export const Flex = styled.div`
  display: flex;
`;
export const NameTitle = styled.p`
  color: rgba(255, 255, 255, 0.514);
  font-size: 20px;
`;
export const TextValue = styled.p`
  font-size: 20px;
`;
export const ValueTextSpan = styled.span`
  font-size: 20px;
`;
export const MarginTopTitle = styled(NameTitle)`
  margin-top: -8px;
`;
export const MarginTopValue = styled(TextValue)`
  margin-top: -8px;
`;
export const ImgWrapperFilmMobile = styled(ImgWrapper)`
  width: 280px;
  margin: 0 auto;
`;
export const ImgWrapFilmMobile = styled(ImgWrap)`
  height: 414.77px;
`;
export const ImgMainMobile = styled(Img)`
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
export const iframe = styled.div`
  position: absolute !important;
  width: 100% !important;
  height: 100% !important;
`;
export const TitleDescription = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-top: 20px;
`;
export const Description = styled.p`
  margin-top: 15px;
  font-size: 18px;
  margin-bottom: 80px;
  width: 100%;
  @media (max-width: 850px){
    margin-bottom: 40px;
  }
`;

export const WrapperDescription = styled.p`
  @media (max-width: 850px){
    padding-left: 25px;
  }
`;

export const SwiperWrapperSimilar = styled.div`

`;


export const ButtonWatch = styled.div`
display: flex;
      justify-content: center;
      align-items: center;
      padding: 25px 0;
    background-color: rgb(184, 22, 22);
  color:rgb(235, 235, 235);
  font-weight:500;
  font-size: 20px;
  cursor: pointer;
  text-decoration: none;
  border: 1px solid rgb(184, 22, 22);
  border-radius: 5px;
  width: 80%;
  height: 30px;
  margin: 0 auto;
  margin-bottom: 45px;
  z-index: 3;
  position: relative;
  &:active {
          background: rgb(147 14 14);
          border: 1px solid rgb(147 14 14);
        }
`;

export const TrailerButtonWatch = styled(ButtonWatch)`
  background-color: rgb(184 22 22 / 0%);
  border: 2px solid rgb(184, 22, 22);
  &:active {
          background: rgb(184 22 22);
          border: 2px solid rgb(147 14 14);
        }
`;

export const Bottom = styled.div`
margin-top: 85px;
`;