import { CrossIconProps } from '@/components/search/Search.types'
import styled from 'styled-components'

export const Wrapper = styled.div`
  margin-top: 90px;
`
export const WrapperNameBlock = styled.div`
  display: flex;
  justify-content: space-between;
  /* было 40px — блок фильтров стоял низко под заголовком */
  margin-bottom: 20px;
  align-items: center;

  /* на телефоне заголовок слева, а кнопка фильтров прижата к правому краю.
     Было flex-start — и кнопка «присасывалась» к названию вместо правого края. */
  @media (max-width: 850px) {
    justify-content: space-between;
    margin-bottom: 24px;
  }
`
export const NameBlock = styled.p`
  font-size: 20px;
  font-weight: bold;

  @media (max-width: 850px) {
    text-align: left;
    margin: 0;
  }
`
export const FilterIcon = styled.div`
 /*  background-image: url('Filtericon.svg'); */
  height: 35px;
  width: 35px;
  background-size: 100%;
  align-self: center;
  background-repeat: no-repeat;
  cursor: pointer;
  @media (min-width: 1151px){
   display: none;
  }
`
export const Button = styled.div`
  background-color: rgb(184, 22, 22);
  color:rgb(235, 235, 235);
  font-weight:500;
  font-size: 18px;
  padding: 8px 15px 8px 15px;
  cursor: pointer;
  text-decoration: none;
  border: 1px solid rgb(184, 22, 22);
  border-radius: 5px;
 
`
/*
 * «Сбросить» — второстепенное действие: без красного фона, тонкая рамка и
 * приглушённый текст. Не должно выглядеть как основная кнопка.
 */
export const ResetButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: rgba(248, 248, 248, 0.72);
  font-weight: 500;
  font-size: 16px;
  padding: 0 18px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 5px;
  transition: border-color 0.2s ease, color 0.2s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.45);
    color: #fff;
  }
`

export const WrapperButtonShowMore = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  margin-bottom: 105px;
  margin-top: 45px;
  @media (max-width: 850px){
    margin-top: 25px;
  }
`
export const CrossIcon = styled.div<CrossIconProps>`
  display: none;
  @media (max-width: 1150px) {
    display: block;
  }

  /* Кнопка закрытия в стиле Apple: круглая серая подложка и белый крестик
     по центру. Так же выглядит закрытие в iOS. */
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(120, 120, 128, 0.36);
  position: relative;
  cursor: pointer;
  margin-left: 20px;
  transition: background 0.15s ease;

  &:active {
    background: rgba(120, 120, 128, 0.56);
  }

  ${(props) =>
    props.sidebar
      ? `margin-left: 0;
    right: 16px;
    top: 16px;
    position: absolute;`
      : ''};
`;

export const Line1 = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 15px;
  height: 2px;
  border-radius: 1px;
  background-color: #fff;
  transform: translate(-50%, -50%) rotate(45deg);
`;

export const Line2 = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 15px;
  height: 2px;
  border-radius: 1px;
  background-color: #fff;
  transform: translate(-50%, -50%) rotate(-45deg);
`;