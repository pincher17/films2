import styled from 'styled-components'

export const ButtonWrapper = styled.div`
  background-color: rgb(184, 22, 22);
  color:rgb(235, 235, 235);
  font-weight:500;
  font-size: 18px;
  cursor: pointer;
  text-decoration: none;
  border: 1px solid rgb(184, 22, 22);
  border-radius: 5px;
  display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
;
  transition: background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;

  /* Наведение: кнопка светлеет и появляется мягкая тень в цвет акцента */
  &:hover {
    background-color: #cf1a1a;
    border-color: #e63939;
    box-shadow: 0 4px 16px rgba(184, 22, 22, 0.35);
  }

  &:active {
    background: rgb(147 14 14);
    border: 1px solid rgb(147 14 14);
    box-shadow: none;
  }
`
