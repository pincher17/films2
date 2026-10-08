import styled from "styled-components";

/**
 * Плашка с сохранённой позицией на странице фильма. Сделана приглушённой:
 * она подсказывает, но не спорит с кнопкой «Смотреть» и не мешает постеру.
 */
export const HintWrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 18px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: default;
  max-width: 420px;
`;

export const HintRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const HintIcon = styled.span`
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #d41515;
  color: #fff;
  padding-left: 2px;

  svg {
    display: block;
    position: relative;
    top: 1px;
  }
`;

export const HintText = styled.span`
  color: rgba(248, 248, 248, 0.72);
  font-size: 14px;
  line-height: 1.3;

  b {
    color: #fff;
    font-weight: 600;
  }
`;

export const HintBar = styled.div`
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.16);
  overflow: hidden;
`;

export const HintFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(props) => props.$percent}%;
  border-radius: 2px;
  background: #d41515;
`;
