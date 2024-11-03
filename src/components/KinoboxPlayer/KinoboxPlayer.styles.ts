import styled from "styled-components";

export const Player = styled.div`
position: relative;
z-index: 2 !important;
 width: 1200px !important;
 height: 100% !important;
 @media (min-width: 1500px){
  width: 1050px !important;
  height: 100% !important;
  }
 @media (max-width: 1500px){
  width: 900px !important;
  height: 100% !important;
  }
  @media (max-width: 1300px){
  width: 750px !important;
  height: 100% !important;
  }
 @media (max-width: 1150px){
  width: 950px !important;
  height: 500px !important;
  margin-top: 20px;
  }
  @media (max-width: 1030px){
    width: 100% !important;
    height: 500px !important;
  }
  @media (max-width: 920px){
    width: 87% !important;
    height: 400px !important;
  }
  @media (max-width: 850px){
    width: 70% !important;
    height: 400px !important;
  }
`