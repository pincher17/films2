import styled from "styled-components";
import { ButtonWatch } from "./FilmPageMobile.styles";

export const WrapperGenre = styled('div')`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  font-size: 14px;
  line-height: 17px;
  border-radius: 8px;
  font-weight: 400;
  background-color: rgb(35 35 35);
  color: rgb(186,186,187);
  border: 1px solid rgb(35 35 35);
  width: 100%;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  &:hover{
    background-color: rgb(50 50 50);
    border: 1px solid rgb(50 50 50);
  }
`;

export const Title = styled('div')`
  margin-left: 10px;
  @media (max-width: 351px){
    font-size: 16px;
  }
`;

export const SvgDiv = styled('div')`
  
`;