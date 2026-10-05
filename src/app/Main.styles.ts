import styled from 'styled-components'

export const MainTag = styled.main`
  margin: 0 auto;
  /* ширина и брейкпоинты те же, что у шапки и страницы фильма */
  width: 1440px;
  max-width: 100%;
  height: 100%;
  border: 1px solid rgba(255, 0, 0, 0);

   @media (max-width: 1500px){
    width: 1250px;
  }
  @media (max-width: 1300px){
    width: 1050px;
  }
  /*
  @media (max-width: 1300px){
    max-width: 1050px;
  } */
  @media (max-width: 1150px){
    width: 800px;
  }
  @media (max-width: 738px){
    max-width: 100%;
    padding-left: 5px;
    padding-right: 5px;
  }
  &>p{
      margin-bottom: 80px;
    }
`
export const H1 = styled.h1`
    font-size: 28px;
    margin-top: 80;
    padding-top: 38px;
    padding-bottom: 20px;
    @media (max-width: 850px){
      padding-top: 0;
    padding-bottom: 15px;
    margin-top: 25px;
    line-height: 33px;
  }
`;