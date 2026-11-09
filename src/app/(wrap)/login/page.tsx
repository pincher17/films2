"use client";

import TelegramLogin from "@/components/TelegramLogin/TelegramLogin";
import React from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import styled from "styled-components";

const Page = styled.div`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: #141414;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 40px 36px;
  text-align: center;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 700;
  color: #fff;
`;

const Subtitle = styled.p`
  margin: 0 0 28px;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.6);
`;

const GoogleButton = styled.button`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #fff;
  color: #1f1f1f;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease;

  &:hover {
    background: #ececec;
  }

  &:active {
    transform: scale(0.99);
  }
`;

const Note = styled.p`
  margin: 22px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.4);
`;

const Back = styled(Link)`
  display: inline-block;
  margin-top: 18px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;

  &:hover {
    color: #fff;
  }
`;

export default function LoginPage() {
  /* Сюда возвращаются с телевизионной страницы подтверждения: после входа
     человека нужно вернуть ровно туда, где он подтверждал код */
  const [next, setNext] = React.useState("/");

  React.useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("next");
    if (value && value.startsWith("/")) setNext(value);
  }, []);

  return (
    <Page>
      <Card>
        <Title>Войти в Filmhub</Title>
        <Subtitle>
          Войдите, чтобы продолжить просмотр с того же места на любом устройстве.
        </Subtitle>

        {/* Вход через Google временно отключён — на сайте работает только Telegram
        <GoogleButton type="button" onClick={() => signIn("google", { callbackUrl: "/" })}>
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9.1h12.4c-.5 2.9-2.2 5.4-4.6 7l7.6 5.9c4.4-4.1 6.7-10.1 6.7-17.4z" />
            <path fill="#FBBC05" d="M10.4 28.7c-.5-1.4-.8-2.9-.8-4.7s.3-3.3.8-4.7l-7.8-6.1C1 16.4 0 20.1 0 24s1 7.6 2.6 10.8l7.8-6.1z" />
            <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.8 2.3-8.3 2.3-6.4 0-11.7-3.7-13.6-9.1l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
          </svg>
          Продолжить с Google
        </GoogleButton> */}

        <TelegramLogin next={next} />

        <Note>
          Мы получаем только имя, фото профиля и адрес почты. Ничего не публикуем и не
          передаём третьим лицам.
        </Note>

        <Back href="/">← Вернуться к фильмам</Back>
      </Card>
    </Page>
  );
}
