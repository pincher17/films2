import styled from 'styled-components'

/**
 * Кнопка «В закладки» на странице фильма.
 * Рядом со «Смотреть», но визуально легче: сохранение — не главное действие.
 */
export const SaveFilmButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 18px;
  border-radius: 8px;
  border: 1px solid
    ${({ $active }) => ($active ? 'rgba(211, 41, 41, 0.7)' : 'rgba(255, 255, 255, 0.18)')};
  background: ${({ $active }) =>
    $active ? 'rgba(211, 41, 41, 0.14)' : 'rgba(255, 255, 255, 0.06)'};
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.12s ease;

  &:hover {
    background: ${({ $active }) =>
      $active ? 'rgba(211, 41, 41, 0.22)' : 'rgba(255, 255, 255, 0.12)'};
  }

  &:active {
    transform: scale(0.98);
  }

  /* на телефоне — во всю ширину, под кнопкой «Смотреть» */
  @media (max-width: 850px) {
    width: 100%;
    height: 52px;
    justify-content: center;
    margin-top: 10px;
  }
`
