"use client";

import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import Link from "next/link";
import TvNav from "@/components/tv/TvNav";
import Logo from "../../../public/assets/img/logo1.svg";

/**
 * Оболочка телевизионной версии.
 *
 * Тёмный фон, крупный шрифт, курсор скрыт, фокус виден всегда. Стили нарочно
 * простые: на телевизорах старые движки, и всё тяжёлое там тормозит.
 */
const Global = createGlobalStyle`
  html, body {
    background: #0b0b0b;
    color: #fff;
    margin: 0;
    padding: 0;
    font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
    scroll-behavior: smooth;
    overscroll-behavior: none;
  }

  body.tv-body {
    cursor: none;
  }

  ::-webkit-scrollbar {
    display: none;
  }
`;

const Shell = styled.div`
  min-height: 100vh;
  padding: 32px 56px 60px;
  box-sizing: border-box;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 26px;

  .logo {
    display: inline-flex;
    align-items: center;
    padding: 8px 10px;
    border-radius: 10px;
    border: 2px solid transparent;
    outline: none;
  }

  .logo svg {
    height: 38px;
    width: auto;
    display: block;
  }

  .logo:focus,
  .logo:focus-visible,
  .logo.tv-focused {
    border-color: #d41515;
    background: #1a1a1a;
    outline: none;
  }

  /* Поиск выглядит как строка, а не как кнопка: так его видно сразу,
     как в YouTube и Netflix, и понятно, что туда можно перейти */
  .search {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    height: 56px;
    min-width: 320px;
    padding: 0 22px;
    border-radius: 28px;
    border: 2px solid #3a3a3a;
    background: #171717;
    color: #b8b8b8;
    font-size: 18px;
    text-decoration: none;
    outline: none;
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  .search svg {
    width: 22px;
    height: 22px;
    flex: 0 0 auto;
  }

  .search .hint {
    color: #6f6f6f;
    font-size: 15px;
    margin-left: auto;
  }

  .search:focus,
  .search:focus-visible,
  .search.tv-focused {
    background: #d41515;
    border-color: #d41515;
    color: #fff;
    outline: none;
  }

  .search:focus .hint,
  .search:focus-visible .hint,
  .search.tv-focused .hint {
    color: rgba(255, 255, 255, 0.75);
  }
`;

export default function TvLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Global />
      <TvNav />
      <Shell>
        <TopBar>
          <Link href="/tv" className="logo" data-tv-focus aria-label="Filmhub">
            <Logo />
          </Link>
          <Link href="/tv/search" className="search" data-tv-focus>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            Поиск
            <span className="hint">название фильма</span>
          </Link>
        </TopBar>
        {children}
      </Shell>
    </>
  );
}
