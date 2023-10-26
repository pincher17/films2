import { CrossIconProps, SearchWrapperProps } from "@/components/search/Search.types";
import styled from "styled-components";

export const SearchWrapper = styled.div<SearchWrapperProps>`
  position: relative;
  width: 600px;
  height: 35px;
  display: flex;
  @media (max-width: 1150px){
    width: 460px;
  }
  @media (max-width: 850px){
    display: ${({active}) => (active ? 'flex' : 'none')};
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translate(-50%, 0);
    height: 40px;
    align-items: center;
    width: 90%;
  }
`;
export const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  background-color: rgb(14 14 14);
  border: 1px solid rgb(52 52 52);
  color: white;
  font-size: 16px;
  position: relative;
  padding-left: 15px;
  @media (max-width: 850px){
    border-radius: 8px;
  }
  border-radius: 5px 0 0 5px;
  &::-webkit-input-placeholder {
    color: rgb(179, 179, 179);
    font-size: 16px;
  }
  &:-ms-input-placeholder {
    color: rgb(179, 179, 179);
    font-size: 16px;
  }
  &::-moz-placeholder {
    color: rgb(179, 179, 179);
    font-size: 16px;
  }
  &:-moz-placeholder {
    color: rgb(179, 179, 179);
    font-size: 16px;
  }
`;
export const ButtonSearch = styled.div`
 @media (max-width: 850px){
    display: none;
  }
    width: 50px;
    background-color: rgb(52 52 52);
    height: 100%;
    /* margin-left: 5px; */
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 0 5px 5px 0;
`;
export const Cancel = styled.div<CrossIconProps>`
display: none;
@media (max-width: 850px){
  display: block;
}
  font-size: 18px;
  font-weight: 400;
  position: relative;
  margin-left: 20px;
  cursor: pointer;
  ${({sidebar}) => ((sidebar) ? 
   `margin-left: 0;
    cursor: pointer;
    right: 47px;
    top: 26px;
    position: absolute;` 
    : '')};
`;



export const SearchList = styled.div`
@media (max-width: 850px){
    width: 100%;
    background: none;
    box-shadow: none;
    top: 40px;
    height: 90vh;
    padding-bottom: 150px;
  }
  width: calc(100% - 50px);
    top: 95%;
    height: 500px;
    background-color: rgb(36,36,36);
    position: absolute;
    padding-top: 20px;
    box-sizing: border-box;
    overflow-y: scroll;
    -webkit-box-shadow: 0px 11px 10px 5px rgba(0, 0, 0, 0.52);
-moz-box-shadow: 0px 11px 10px 5px rgba(0, 0, 0, 0.52);
box-shadow: 0px 11px 10px 5px rgba(0, 0, 0, 0.52);
`;

export const ImageWrapper = styled.div`
    display: flex;
    padding-left: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    &:hover{
      background-color: rgb(24,24,24);
    }
`;
export const Image = styled.img`
    width: 98px;
    height: 142px;
    margin-right: 20px;
`;
export const Name = styled.div`
    font-weight: bold;
    margin-bottom: 8px;
`;
export const Year = styled.div`
    font-weight: lighter;
    color: rgba(255, 255, 255, 0.822);
    margin-bottom: 8px;
`;
export const RatingNumer = styled.div`
    font-weight: bold;
    color: rgb(59,179,59);
`;

export const AllBlur = styled.div<SearchWrapperProps>`
  display: ${({active}) => (active ? 'block' : 'none')};
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  width: 145vw;
  height: 145vh;
  background-color: rgb(0 0 0 / 80%);
  -webkit-backdrop-filter: blur(35px);
  backdrop-filter: blur(35px);
  background: rgb(21 21 21 / 83%);
`;
