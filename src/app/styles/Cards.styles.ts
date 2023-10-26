import styled from 'styled-components'

export const Wrapper = styled.div`
  display: grid;
  justify-items: center; 
  grid-gap: 20px;
  gap: 20px;
  grid-template-columns: repeat(6,1fr);

  @media (max-width: 1499px){
    grid-template-columns: repeat(5,1fr);
  }

  @media (max-width: 1300px){
    grid-template-columns: repeat(4,1fr);
  }

  @media (max-width: 999px){
   /*  -webkit-column-gap: 54px;
    -moz-column-gap: 54px;
    grid-column-gap: 54px; */
    grid-template-columns: repeat(3,1fr);
  }

  @media (max-width: 738px){
   /*  -webkit-column-gap: 54px;
    -moz-column-gap: 54px;
    grid-column-gap: 54px; */
    grid-template-columns: repeat(2,1fr);
  }
`
