import styled from 'styled-components'

export const Wrapper = styled.div`
  /* как на странице каталога: без этого контент заезжает под шапку */
  margin-top: 90px;
  padding-bottom: 40px;

  @media (max-width: 850px) {
    margin-top: 90px;
    padding: 0 20px 96px;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 18px;

  & > h1 {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
  }

  & > span {
    font-size: 15px;
    color: #8a8a8a;
  }
`

/** Строка управления: фильтр типов слева, сортировка справа */
export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`

export const Chips = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`

/** Чип фильтра: активный залит, неактивный приглушён */
export const Chip = styled.button<{ $active?: boolean }>`
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid ${({ $active }) => ($active ? '#d32929' : '#343434')};
  background: ${({ $active }) => ($active ? '#d32929' : '#0e0e0e')};
  color: ${({ $active }) => ($active ? '#fff' : '#c9c9c9')};
  font-size: 15px;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;

  &:hover {
    border-color: ${({ $active }) => ($active ? '#d32929' : '#5a5a5a')};
  }
`

export const Sort = styled.select`
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #343434;
  background: #0e0e0e;
  color: #fff;
  font-size: 15px;
  cursor: pointer;

  &:focus-visible {
    outline: none;
    border-color: #747474;
  }
`

/** Пустое состояние: не выглядит сломанным и объясняет, что делать */
export const Empty = styled.div`
  padding: 56px 20px;
  text-align: center;
  border: 1px dashed #343434;
  border-radius: 16px;

  & > h2 {
    margin: 0 0 10px;
    font-size: 20px;
    font-weight: 700;
  }

  & > p {
    margin: 0;
    color: #9a9a9a;
    font-size: 15px;
    line-height: 1.5;
  }
`
