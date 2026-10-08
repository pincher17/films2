import styled from 'styled-components'
import { FiltersWrapperProps } from '../../components/Filters/Filters.types'

export const Wrapper = styled.div<FiltersWrapperProps>`
 margin-bottom: 50px;
`
export const WrapperInput = styled.div`
  /* было 55px — под колонками фильтров оставалась пустота перед кнопками */
  padding-bottom: 28px;
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
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
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

  & > *:first-child {
    display: flex;
    align-items: center;
    padding-left: 22px;
    padding-right: 22px;
    font-size: 16px;
  }
`

/**
 * Таблетка выбора типа: активная залита красным, неактивная — тёмная с рамкой.
 * Заменила чекбоксы: столбик из галочек занимал три строки и читался как
 * настройки, а не как выбор того, что смотреть.
 */
export const FilterPill = styled.label<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  background: ${(props) => (props.$active ? "#d41515" : "rgba(255, 255, 255, 0.06)")};
  border: 1px solid ${(props) => (props.$active ? "#d41515" : "rgba(255, 255, 255, 0.14)")};
  color: ${(props) => (props.$active ? "#fff" : "rgba(248, 248, 248, 0.72)")};

  input {
    display: none;
  }

  &:hover {
    border-color: ${(props) => (props.$active ? "#d41515" : "rgba(255, 255, 255, 0.35)")};
  }

  svg {
    display: block;
    opacity: ${(props) => (props.$active ? 1 : 0.75)};
  }
`
