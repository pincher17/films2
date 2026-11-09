"use client";

import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import TvNav from "@/components/tv/TvNav";

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
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  .logo b {
    background: #d41515;
    border-radius: 6px;
    padding: 2px 8px;
    margin-left: 2px;
  }
`;

export default function TvLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Global />
      <TvNav />
      <Shell>
        <TopBar>
          <div className="logo">
            Film<b>hub</b>
          </div>
        </TopBar>
        {children}
      </Shell>
    </>
  );
}
