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
  flex-direction: column;
  gap: 10px;
  /*
   * Сдвигаем визуально, а не отступом: контейнер выравнивает колонки по
   * базовой линии, и margin-top потянул бы вниз «Рейтинг», «Год», «Жанры».
   */
  position: relative;
  top: 30px;
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
 * Строка выбора типа: не красная заливка, а плитка с квадратом-галочкой.
 * Активная — ярче рамка и галочка, неактивная — приглушённая.
 */
export const FilterPill = styled.label<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  /* те же цвета, что у селектов «Жанры» и «Страны»: фон #0e0e0e, рамка #343434 */
  /* фон и рамка одинаковые в обоих состояниях — как у селектов «Жанры» и «Страны».
     Активность показывают квадрат-галочка и цвет текста, а не рамка. */
  background: #0e0e0e;
  border: 1px solid #343434;
  color: ${(props) => (props.$active ? "#fff" : "rgba(248,248,248,0.6)")};

  input {
    display: none;
  }

  &:hover {
    border-color: #4a4a4a;
  }

  svg {
    display: block;
    flex-shrink: 0;
  }
`

/** Квадрат слева: показывает, что элемент можно нажать */
export const PillBox = styled.span<{ $active?: boolean }>`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, border-color 0.2s ease;

  background: ${(props) => (props.$active ? "#d41515" : "transparent")};
  border: 1.5px solid ${(props) => (props.$active ? "#d41515" : "rgba(255,255,255,0.28)")};
  color: #fff;
`
