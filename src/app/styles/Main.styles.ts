import styled from 'styled-components'

export const MainTag = styled.main`
  /* Тот же контейнер, что у шапки и у страницы фильма
     (LayoutFilm.module.css): три разных ширины давали расхождение краёв. */
  width: 1440px;
  max-width: 100%;
  margin: 0 auto;
  height: 100%;
  border: 1px solid rgba(255, 0, 0, 0);

  @media (max-width: 1500px) {
    width: 1250px;
  }

  @media (max-width: 1300px) {
    width: 1050px;
  }

  @media (max-width: 1150px) {
    width: 800px;
  }

  @media (max-width: 850px) {
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
  }
`;