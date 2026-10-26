import styled from 'styled-components'

export const Wrapper = styled.div`
  /* тянется по своей ячейке сетки, как остальные поля: раньше стояло
     222px, и «Рейтинг» с «Годом» были заметно уже списков */
  width: 100%;
  /* без этого ползунок вылезал за край: у MUI-слайдера своя ширина,
     и он растягивался шире панели */
  max-width: 100%;
  box-sizing: border-box;

  & .MuiSlider-root {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    /* бегунки на краях дорожки не должны смыкаться с соседним полем */
    padding-left: 2px;
    padding-right: 2px;
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

/**
 * Подпись поля. Размер и цвет совпадают с подписями списков — иначе
 * «Рейтинг» и «Год» выглядели из другого интерфейса.
 */
export const Title = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);
  /* та же высота строки подписи, что у списков */
  height: 18px;
  line-height: 18px;
  margin-bottom: 8px;
  white-space: nowrap;
`

export const WrapperInputs = styled.div`
 display: flex;
 margin-bottom: 12px;

 /* Общая высота со списками. 44px — рекомендованный минимум для нажатия
    пальцем (Apple HIG), на компьютере достаточно 40px. */
 & .input {
  height: 40px;
  box-sizing: border-box;
 }
 & > :first-child{
  margin-right: 30px;
 }
 @media (max-width: 850px){
  & .input{
  height: 44px;
 }
  }

`