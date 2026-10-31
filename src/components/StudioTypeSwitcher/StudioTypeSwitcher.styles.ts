import styled from "styled-components";

/** Пилюля с сегментами — видна и на компьютере, и на телефоне */
export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  max-width: 560px;
  padding: 4px;
  margin: 0 0 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-sizing: border-box;

  @media (max-width: 850px) {
    max-width: 100%;
    margin: 0 0 16px;
  }
`;

/** Сегмент */
export const Segment = styled.button<{ $active?: boolean }>`
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 9px 18px;
  border: none;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? "#c9151a" : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "rgba(255, 255, 255, 0.65)")};
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: ${({ $active }) => ($active ? "#c9151a" : "rgba(255, 255, 255, 0.09)")};
    color: #fff;
  }

  @media (max-width: 850px) {
    padding: 10px 8px;
    font-size: 13px;
    min-height: 40px;
  }
`;
