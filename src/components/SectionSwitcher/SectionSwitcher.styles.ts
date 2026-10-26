import styled from "styled-components";
import Link from "next/link";

/** Пилюля с сегментами */
export const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  margin: 0 0 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: 850px) {
    display: flex;
    width: 100%;
    margin: 0 0 16px;
  }
`;

/** Сегмент */
export const Segment = styled(Link)<{ $active?: boolean }>`
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 9px 20px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  color: ${({ $active }) => ($active ? "#fff" : "rgba(255, 255, 255, 0.6)")};
  background: ${({ $active }) => ($active ? "#c9151a" : "transparent")};
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: ${({ $active }) =>
      $active ? "#c9151a" : "rgba(255, 255, 255, 0.09)"};
    color: #fff;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 850px) {
    padding: 11px 8px;
    font-size: 13px;
    min-height: 42px;
  }
`;
