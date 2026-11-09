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

  .logo svg {
    height: 38px;
    width: auto;
    display: block;
  }

  .search {
    display: inline-flex;
    align-items: center;
    height: 52px;
    padding: 0 26px;
    border-radius: 10px;
    border: 2px solid #2f2f2f;
    background: #141414;
    color: #fff;
    font-size: 18px;
    text-decoration: none;
    outline: none;
  }

  .search:focus,
  .search:focus-visible {
    background: #d41515;
    border-color: #d41515;
    outline: none;
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
            Поиск
          </Link>
        </TopBar>
        {children}
      </Shell>
    </>
  );
}
