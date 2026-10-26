import styled from "styled-components";
import Link from "next/link";

/** Обёртка: заголовок с меню */
export const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

/** Крупный заголовок-кнопка */
export const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0;
  border: none;
  background: none;
  color: #fff;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.5px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.75;
  }

  @media (max-width: 850px) {
    font-size: 24px;
    gap: 8px;
  }
`;

/** Стрелка: поворачивается при открытии */
export const Caret = styled.span<{ $open?: boolean }>`
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 8px solid #c9151a;
  transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  transition: transform 0.2s ease;
`;

/** Выпадающий список */
export const Menu = styled.div<{ $open?: boolean }>`
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  min-width: 230px;
  padding: 6px;
  border-radius: 14px;
  background: #161616;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.6);
  z-index: 60;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transform: translateY(${({ $open }) => ($open ? "0" : "-6px")});
  transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s;

  @media (max-width: 850px) {
    min-width: 0;
    width: 100%;
  }
`;

/** Пункт меню */
export const Item = styled(Link)<{ $active?: boolean }>`
  display: block;
  padding: 12px 14px;
  border-radius: 10px;
  color: ${({ $active }) => ($active ? "#fff" : "rgba(255, 255, 255, 0.72)")};
  background: ${({ $active }) => ($active ? "rgba(201, 21, 26, 0.9)" : "transparent")};
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${({ $active }) =>
      $active ? "rgba(201, 21, 26, 0.9)" : "rgba(255, 255, 255, 0.08)"};
    color: #fff;
  }

  @media (max-width: 850px) {
    padding: 14px;
    font-size: 16px;
  }
`;
