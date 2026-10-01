"use client";

/**
 * Скелетон страницы фильма для десктопа.
 *
 * Показывается, пока грузятся данные: повторяет сетку реальной страницы
 * (обложка, постер, заголовок, кнопки, описание, похожие), чтобы переход
 * не выглядел как сломанный интерфейс.
 */

import React from "react";
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.55; }
  100% { opacity: 1; }
`;

const block = `
  background-color: #2a2a2a;
  animation: ${pulse} 1.4s ease-in-out infinite;
`;

const Wrapper = styled.div`
  max-width: 1220px;
  margin: 0 auto;
  padding: 0 20px 60px;
`;

const Backdrop = styled.div`
  ${block};
  height: 420px;
  border-radius: 12px;
  background-image: linear-gradient(90deg, #333 0%, #262626 60%, #1f1f1f 100%);
  margin-top: 20px;
`;

const Row = styled.div`
  display: flex;
  gap: 40px;
  margin-top: -120px;
  position: relative;
  padding: 0 30px;

  @media (max-width: 850px) {
    margin-top: 20px;
    padding: 0;
  }
`;

const Left = styled.div`
  flex: 1;
  padding-top: 140px;
`;

const Title = styled.div`
  ${block};
  height: 46px;
  width: 70%;
  border-radius: 8px;
`;

const Meta = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 22px;
`;

const Chip = styled.div`
  ${block};
  height: 20px;
  width: 74px;
  border-radius: 6px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 28px;
`;

const Button = styled.div`
  ${block};
  height: 46px;
  width: 170px;
  border-radius: 8px;
`;

const Line = styled.div<{ $w?: string }>`
  ${block};
  height: 14px;
  width: ${(props) => props.$w || "100%"};
  border-radius: 5px;
  margin-top: 12px;
`;

const Poster = styled.div`
  ${block};
  width: 260px;
  height: 390px;
  border-radius: 12px;
  flex-shrink: 0;
  margin-top: 60px;
`;

const Section = styled.div`
  margin-top: 60px;
`;

const SectionTitle = styled.div`
  ${block};
  height: 26px;
  width: 220px;
  border-radius: 6px;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  margin-top: 24px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Card = styled.div``;

const CardPoster = styled.div`
  ${block};
  width: 100%;
  padding-bottom: 150%;
  border-radius: 12px;
`;

const FilmSkeleton: React.FC = () => (
  <Wrapper aria-busy="true" aria-label="Загрузка страницы фильма">
    <Backdrop />
    <Row>
      <Left>
        <Title />
        <Meta>
          <Chip />
          <Chip />
          <Chip />
        </Meta>
        <Buttons>
          <Button />
          <Button />
        </Buttons>
        <div style={{ marginTop: 34 }}>
          <Line />
          <Line $w="92%" />
          <Line $w="64%" />
        </div>
      </Left>
      <Poster />
    </Row>
    <Section>
      <SectionTitle />
      <Cards>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item}>
            <CardPoster />
            <Line $w="80%" />
            <Line $w="40%" />
          </Card>
        ))}
      </Cards>
    </Section>
  </Wrapper>
);

export default FilmSkeleton;
