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

  /* Курсор убираем у всего: на телевизоре он не нужен и иногда «мигает»,
     когда браузер его всё-таки показывает */
  body.tv-body,
  body.tv-body * {
    cursor: none !important;
  }

  /* Но на открытом плеере курсор нужен: только им можно попасть в его
     собственные кнопки — перемотка, озвучка, качество, пропуск рекламы.
     Область плеера помечает себя data-tv-scope. */
  body.tv-body [data-tv-scope],
  body.tv-body [data-tv-scope] * {
    cursor: default !important;
  }

  ::-webkit-scrollbar {
    display: none;
  }
`;

const Shell = styled.div`
  min-height: 100vh;
  /* 80 px при ширине 1920 — это 4,2%. Телевизоры часто обрезают 3–5% по
     краям (оверскан), и при 56 px интерфейс мог уехать за кадр. */
  padding: 40px 80px 64px;
  box-sizing: border-box;

  @media (max-width: 1366px) {
    padding: 32px 56px 48px;
  }
`;

const TopBar = styled.header`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;
  margin-bottom: 26px;

  .logo {
    display: inline-flex;
    align-items: center;
    justify-self: start;
  }

  .logo svg {
    height: 38px;
    width: auto;
    display: block;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 14px;
    justify-self: end;
  }

  .action {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    height: 52px;
    padding: 0 22px;
    border-radius: 26px;
    border: 2px solid #3a3a3a;
    background: #171717;
    color: #b8b8b8;
    font-size: 17px;
    text-decoration: none;
    outline: none;
    white-space: nowrap;
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  .action svg {
    width: 20px;
    height: 20px;
    flex: 0 0 auto;
  }

  .action:focus,
  .action:focus-visible,
  .action.tv-focused {
    background: #d41515;
    border-color: #d41515;
    color: #fff;
    outline: none;
  }

  .login {
    border-color: #d41515;
    background: #d41515;
    color: #fff;
  }

  .login:focus,
  .login:focus-visible,
  .login.tv-focused {
    background: #fff;
    border-color: #fff;
    color: #0b0b0b;
  }

  /* Поиск по центру: это главное действие на телевизоре */
  .search {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    height: 56px;
    min-width: 460px;
    padding: 0 24px;
    border-radius: 28px;
    border: 2px solid #3a3a3a;
    background: #171717;
    color: #b8b8b8;
    font-size: 18px;
    text-decoration: none;
    outline: none;
    justify-self: center;
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
          {/* Логотип не в фокусе: с пульта он никуда не ведёт, а первым
              делом человек должен попадать в поиск */}
          <div className="logo" aria-hidden>
            <Logo />
          </div>

          <Link href="/tv/search" className="search" data-tv-focus>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            Поиск
            <span className="hint">название фильма</span>
          </Link>

          <div className="right">
            <Link href="/tv/saved" className="action" data-tv-focus>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1z" />
              </svg>
              Сохранённое
            </Link>
            <Link href="/login" className="action login" data-tv-focus>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
              </svg>
              Войти
            </Link>
          </div>
        </TopBar>
        {children}
      </Shell>
    </>
  );
}
