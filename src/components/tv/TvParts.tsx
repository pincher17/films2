"use client";

/**
 * Карточка и ряд для телевизора.
 *
 * Ничего лишнего: постер, название, крупная рамка при фокусе. Никаких блюров и
 * теней — на телевизорах слабое железо, тяжёлые эффекты там дают рывки.
 */

import React from "react";
import Link from "next/link";
import styled from "styled-components";

export const TvCard = styled(Link)`
  display: block;
  width: clamp(150px, 10.5vw, 208px);
  flex: 0 0 auto;
  text-decoration: none;
  color: #fff;
  border-radius: 10px;
  outline: none;
  transition: transform 0.15s ease;

  img {
    display: block;
    width: 100%;
    aspect-ratio: 2 / 3;
    height: auto;
    object-fit: cover;
    border-radius: 10px;
    background: #1a1a1a;
    border: 3px solid transparent;
  }

  span {
    display: block;
    margin-top: 8px;
    font-size: 15px;
    line-height: 1.25;
    color: #d5d5d5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:focus,
  &:focus-visible,
  &.tv-focused {
    transform: scale(1.05);
    outline: none;
    z-index: 2;
  }

  &:focus img,
  &:focus-visible img,
  &.tv-focused img {
    border-color: #d41515;
  }

  &:focus span,
  &:focus-visible span,
  &.tv-focused span {
    color: #fff;
  }
`;

export const TvRow = styled.section`
  margin-bottom: 34px;

  h2 {
    margin: 0 0 14px;
    font-size: 24px;
    font-weight: 700;
    color: #fff;
  }
`;

export const TvRowScroll = styled.div`
  display: flex;
  gap: 18px;
  overflow-x: auto;
  overflow-y: hidden;
  /* Запас сверху и снизу: карточка при фокусе увеличивается, и без отступа
     её срезало бы краем прокручиваемой области */
  padding: 18px 6px 16px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TvPill = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  height: 52px;
  padding: 0 20px;
  border-radius: 10px;
  border: 2px solid ${(props) => (props.$active ? "#d41515" : "#333")};
  background: ${(props) => (props.$active ? "#d41515" : "#141414")};
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  outline: none;

  &:focus,
  &:focus-visible,
  &.tv-focused {
    border-color: #d41515;
    background: #d41515;
    outline: none;
  }
`;

export const TvAction = styled.button<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 58px;
  padding: 0 32px;
  border-radius: 10px;
  border: 2px solid ${(props) => (props.$primary ? "#d41515" : "#3a3a3a")};
  background: ${(props) => (props.$primary ? "#d41515" : "#141414")};
  color: #fff;
  font-size: 19px;
  font-weight: 600;
  cursor: pointer;
  outline: none;

  &:focus,
  &:focus-visible,
  &.tv-focused {
    outline: none;
    box-shadow: 0 0 0 3px #fff inset;
  }
`;

/** Карточка карточки фильма */
export function TvPosterCard({
  href,
  poster,
  name,
}: {
  href: string;
  poster?: string | null;
  name: string;
}) {
  return (
    <TvCard href={href} data-tv-focus>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster || ""} alt={name} loading="lazy" />
      <span>{name}</span>
    </TvCard>
  );
}

/** Карточка «продолжить просмотр»: полоска прогресса и подпись серии */
export const TvProgressCardWrap = styled(Link)`
  display: block;
  width: clamp(150px, 10.5vw, 208px);
  flex: 0 0 auto;
  text-decoration: none;
  color: #fff;
  border-radius: 10px;
  outline: none;
  transition: transform 0.15s ease;

  .poster {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    border: 3px solid transparent;
    background: #1a1a1a;
  }

  img {
    display: block;
    width: 100%;
    aspect-ratio: 2 / 3;
    object-fit: cover;
  }

  .bar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 6px;
    background: rgba(255, 255, 255, 0.25);
  }

  .bar span {
    display: block;
    height: 100%;
    background: #d41515;
  }

  .name {
    display: block;
    margin-top: 8px;
    font-size: 15px;
    color: #d5d5d5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sub {
    display: block;
    margin-top: 2px;
    font-size: 13px;
    color: #8a8a8a;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:focus,
  &:focus-visible,
  &.tv-focused {
    transform: scale(1.05);
    outline: none;
    z-index: 2;
  }

  &:focus .poster,
  &:focus-visible .poster,
  &.tv-focused .poster {
    border-color: #d41515;
  }

  &:focus .name,
  &:focus-visible .name,
  &.tv-focused .name {
    color: #fff;
  }
`;

export function TvProgressCard({
  href,
  poster,
  name,
  percent,
  subtitle,
}: {
  href: string;
  poster?: string | null;
  name: string;
  percent?: number | null;
  subtitle?: string | null;
}) {
  return (
    <TvProgressCardWrap href={href} data-tv-focus>
      <div className="poster">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={poster || ""} alt={name} loading="lazy" />
        {typeof percent === "number" && percent > 0 ? (
          <div className="bar">
            <span style={{ width: `${Math.min(100, percent)}%` }} />
          </div>
        ) : null}
      </div>
      <span className="name">{name}</span>
      {subtitle ? <span className="sub">{subtitle}</span> : null}
    </TvProgressCardWrap>
  );
}
