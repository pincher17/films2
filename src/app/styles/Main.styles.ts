import styled from 'styled-components'

export const MainTag = styled.main`
  margin: 0 auto;
  max-width: 1440px;
  height: 100%;
  border: 1px solid rgba(255, 0, 0, 0);
  padding-left: 20px;
  padding-right: 20px;

   @media (max-width: 1500px){
    max-width: 1350px;
    padding-left: 70px;
    padding-right: 70px;
  }
  /*
  @media (max-width: 1300px){
    max-width: 1050px;
  } */
  @media (max-width: 1150px){
    /* max-width: 774px; */
  }
  @media (max-width: 738px){
    max-width: 100%;
    padding-left: 5px;
    padding-right: 1px;
  }
  &>p{
      margin-bottom: 80px;
    }
`
export const H1 = styled.h1`
    font-size: 28px;
    @media (max-width: 850px){
      
    margin-top: 25px;
  }
`;