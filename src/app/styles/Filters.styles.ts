import styled from 'styled-components'
import { FiltersWrapperProps } from '../../components/Filters/Filters.types'

export const Wrapper = styled.div<FiltersWrapperProps>`
 margin-bottom: 50px;
`
export const WrapperInput = styled.div`
  padding-bottom: 55px;
  @media (max-width: 850px){
    margin-top: -20px;
    padding-bottom: 40px;
  }
`

export const WrapperAllInputs = styled.div`
    width: 100%;
    margin-bottom: -70px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  @media (max-width: 1150px){
    flex-direction: column;
    align-items: flex-start;
    gap: 43px;
  }
`

export const WrapperCheckbox = styled.div`
 display: flex;
 display: flex;
 flex-direction: column;
 gap: 20px;
`

export const ButtonWrapper = styled.div`
 width: 220px;
 @media (max-width: 850px){
  margin-top: 70px;
    margin-bottom: 250px;
  }
`
/**
 * Кнопки действий под фильтрами: одинаковая высота у обеих (align-items
 * stretch) и воздух по бокам у основной — иначе текст упирается в края.
 */
export const FiltersActions = styled.div`
  display: flex;
  align-items: stretch;
  gap: 12px;
  /* флекс-контейнер убрал отступ, который давала кнопка — возвращаем вручную */
  margin-top: 56px;

  & > *:first-child {
    display: flex;
    align-items: center;
    padding-left: 22px;
    padding-right: 22px;
    font-size: 16px;
  }
`
