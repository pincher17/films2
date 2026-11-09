"use client";

/**
 * Подтверждение входа на телевизоре — открывается на телефоне по QR.
 *
 * Человек уже вошёл через Telegram на телефоне; здесь достаточно нажать одну
 * кнопку. Если не вошёл — отправляем на обычный вход и возвращаемся сюда же.
 */

import React from "react";
import Link from "next/link";
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
  max-width: 460px;
  background: #141414;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 40px 36px;
  text-align: center;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
`;

const Title = styled.h1`
  margin: 0 0 10px;
  font-size: 24px;
  color: #fff;
`;

const Text = styled.p`
  margin: 0 0 24px;
  font-size: 15px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.6);
`;

const Button = styled.button`
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 10px;
  background: #d41515;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const Code = styled.div`
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 5px;
  color: #fff;
  margin: 0 0 22px;
`;

const Back = styled(Link)`
  display: inline-block;
  margin-top: 18px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
`;

export default function LinkPage() {
  /* Адрес читаем сами, а не через useSearchParams: тот требует Suspense и
     ломает сборку страницы */
  const [code, setCode] = React.useState("");

  React.useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("code") || "";
    setCode(value.toUpperCase());
  }, []);

  const [state, setState] = React.useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = React.useState("");

  const confirm = async () => {
    setState("busy");
    setMessage("");
    try {
      const response = await fetch("/api/tv/auth/confirm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json().catch(() => null);

      if (response.ok) {
        setState("done");
        return;
      }

      if (response.status === 401) {
        window.location.href = `/login?next=${encodeURIComponent(`/link?code=${code}`)}`;
        return;
      }

      setState("error");
      setMessage(data?.error || "Не получилось подтвердить");
    } catch {
      setState("error");
      setMessage("Сервер недоступен");
    }
  };

  if (!code) {
    return (
      <Page>
        <Card>
          <Title>Нет кода</Title>
          <Text>Откройте ссылку из QR-кода на телевизоре ещё раз.</Text>
          <Back href="/">← На главную</Back>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <Card>
        {state === "done" ? (
          <>
            <Title>Готово</Title>
            <Text>Вход подтверждён. Телевизор обновится сам через пару секунд.</Text>
            <Back href="/">← На главную</Back>
          </>
        ) : (
          <>
            <Title>Войти на телевизоре</Title>
            <Text>Подтвердите вход — на телевизоре ничего вводить не нужно.</Text>
            <Code>{code}</Code>

            <Button type="button" onClick={confirm} disabled={state === "busy"}>
              {state === "busy" ? "Подтверждаю…" : "Подтвердить вход"}
            </Button>

            {state === "error" ? <Text style={{ marginTop: 18 }}>{message}</Text> : null}

            <Back href="/">← На главную</Back>
          </>
        )}
      </Card>
    </Page>
  );
}
