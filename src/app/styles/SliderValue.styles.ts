import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 222px;
  /* без этого ползунок вылезал за край: у MUI-слайдера своя ширина,
     и он растягивался шире панели */
  max-width: 100%;
  box-sizing: border-box;

  & .MuiSlider-root {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  /* На телефоне тонкую дорожку и мелкий бегунок тяжело тянуть пальцем */
  @media (max-width: 850px) {
    /* Сужение ползунка ТОЛЬКО на телефоне: раньше правило стояло без условия
       и ломало вид на компьютере. */
    & .MuiSlider-root {
      width: calc(100% - 44px);
      max-width: calc(100% - 44px);
      margin-left: 22px;
      margin-right: 22px;
    }

    & .MuiSlider-rail,
    & .MuiSlider-track {
      height: 8px;
      border-radius: 4px;
    }

    & .MuiSlider-thumb {
      width: 26px;
      height: 26px;
    }
  }
  @media (max-width: 850px){
  /* Поля и блок в целом — во всю ширину, как у плиток и списков */
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 0;
 }
`

export const Title = styled.div`
  font-size: 18px;
`

export const WrapperInputs = styled.div`
 display: flex;
 margin-bottom: 12px;
 & > :first-child{
  margin-right: 30px;
 }
 @media (max-width: 850px){
  & .input{
  height: 50px;
 }
  }

`