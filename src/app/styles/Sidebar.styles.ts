import { SidebarContainerProps } from "@/components/Sidebar";
import styled from "styled-components";

export const SidebarContainer = styled.div<SidebarContainerProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  transition: transform 0.3s ease-in-out;
  transform: ${({ isopen }) => (isopen ? 'translateX(0)' : 'translateX(100%)')};
  overflow: scroll;
  background-color: rgb(0 0 0 / 80%);
  -webkit-backdrop-filter: blur(35px);
  backdrop-filter: blur(35px);
  background: rgb(21 21 21 / 83%);
`;

export const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  color: #fff;
  padding-top: 105px;
  padding-left: 20px;
  padding-bottom: 150px;
`;

export const Title = styled.div`
  position: absolute;
  top: 30px;
  left: 20px;
  font-size: 28px;
  font-weight: bold;
`;

export const SidebarButton = styled.button`
  color: #fff;
  font-size: 18px;
  padding: 10px 20px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;
/* Внутренняя оболочка шторки: колонка «шапка — прокрутка — низ» */
export const SheetInner = styled.div`
  /* position: relative обязателен: без него абсолютные элементы (крестик)
     привязываются не к оболочке, а к прокручиваемому блоку и уезжают вместе
     с содержимым. Оболочка сама не прокручивается. */
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  width: 100%;
  /* box-sizing обязателен: без него отступы 20px прибавлялись к 100% ширины,
     из-за чего содержимое вылезало вправо и появлялась горизонтальная прокрутка */
  box-sizing: border-box;
  overflow: hidden;
  overflow-x: hidden;
  padding: 0 20px 0;
`;

/* «Язычок» сверху: показывает, что шторку можно тянуть вниз */
export const SheetGrabber = styled.div`
  flex: 0 0 auto;
  width: 44px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.32);
  margin: 5px auto 0;
`;

/* Заголовок шторки. padding-right оставляет место крестику, который висит
   в правом углу этой же строки. */
export const SheetTitle = styled.div`
  flex: 0 0 auto;
  font-size: 28px;
  font-weight: 700;
  line-height: 38px;
  padding: 6px 52px 14px 0;
  color: #fff;
`;

/* Кнопка закрытия шторки. Лежит в оболочке (она не прокручивается) и
   привязана к ней, поэтому не уезжает вместе со списком. Крестик нарисован
   псевдоэлементами — так надёжнее, чем отдельные полоски в разметке. */
export const SheetClose = styled.button`
  position: absolute;
  /* Полоска 46px, кнопка 34px → (46 − 34) / 2 = 6px: ровно по центру,
     а не прижата к верхнему краю. */
  top: 6px;
  right: 0;
  width: 34px;
  height: 34px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(120, 120, 128, 0.36);
  cursor: pointer;
  z-index: 10;
  transition: background 0.15s ease;

  &:active {
    background: rgba(120, 120, 128, 0.56);
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 15px;
    height: 2px;
    border-radius: 1px;
    background: #fff;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`;

/* Шапка шторки — отдельная строка фиксированной высоты. Она не прокручивается,
   и содержимое начинается под ней, поэтому кнопка закрытия ничего не перекрывает
   и всегда стоит в шапке. */
export const SheetHeader = styled.div`
  position: relative;
  flex: 0 0 auto;
  /* Полоска шапки под язычок и крестик. 46px — крестик 34px плюс равные
     отступы сверху и снизу, поэтому кнопка стоит по центру полоски. */
  height: 46px;
  width: 100%;
`;
