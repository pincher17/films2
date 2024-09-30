import styled from "styled-components";
import { ImageCollection } from "../CardCollection";
import { NameBlock, WrapperNameBlock } from "@/app/styles/AllFilmsPage.styles";

export const WrapperImageStudio = styled.div`
 display: flex;
    /* justify-content: center; */
    align-items: center;
    width: 250px;
    height: 150px;
    overflow: hidden;
    position: relative;
    margin: 0 auto;
    @media (max-width: 600px){
      width: 210px;
      height: 125px;
      margin-top: -20px;
  }
`;

export const Image = styled.img`
 max-width: 100%; /* Ограничиваем ширину изображения */
`;

export const NameStudio = styled(NameBlock)`
  font-size: 40px;
  @media (max-width: 850px){
    font-size: 35px;
  }
  @media (max-width: 500px){
    font-size: 30px;
  }
/*   @media (max-width: 650px){
    margin-top: 20px;
  } */
`;

export const WrapperName = styled(WrapperNameBlock)`

  @media (max-width: 650px){
    margin-top: 20px;
  }
`;