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
 display: flex;
 flex-direction: column;
 gap: 20px;
 /*
  * Колонка чекбоксов визуально стояла выше остальных: у соседних колонок
  * сверху подпись («Рейтинг», «Год»), а здесь сразу пункты. Опускаем,
  * чтобы центр совпал с их полями и ползунками.
  */
 /*
  * Сдвигаем колонку визуально, а НЕ отступом: контейнер выравнивает колонки
  * по базовой линии (align-items: baseline), поэтому margin-top у одного
  * элемента тянул вниз и «Рейтинг», «Год», «Жанры» вместе с ним.
  */
 /*
  * Небольшой сдвиг вниз: ровно по подписи «Рейтинг» чекбоксы читаются
  * слишком высоко, опускаем к уровню полей с цифрами.
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
