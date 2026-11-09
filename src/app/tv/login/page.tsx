"use client";

/**
 * Вход на телевизоре.
 *
 * Ничего набирать не нужно: телевизор показывает код и QR, человек сканирует
 * его телефоном и нажимает «Подтвердить». Телевизор раз в две секунды
 * спрашивает сервер, не подтвердили ли вход, и сам получает сессию.
 */

import React from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { TvAction, TvRow } from "@/components/tv/TvParts";

type Started = {
  code: string;
  link: string;
  qr: string;
};

const Wrap = styled.div`
  display: flex;
  gap: 64px;
  align-items: center;
  margin-top: 20px;
`;

const QrBox = styled.div`
  width: 340px;
  height: 340px;
  background: #fff;
  border-radius: 16px;
  padding: 10px;
  box-sizing: border-box;
  flex: 0 0 auto;

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const Steps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;

  ol {
    margin: 0;
    padding-left: 26px;
    color: #c8c8c8;
    font-size: 20px;
    line-height: 1.6;
  }

  li {
    margin-bottom: 8px;
  }
`;

const Code = styled.div`
  font-size: 46px;
  font-weight: 700;
  letter-spacing: 6px;
  color: #fff;
  margin: 6px 0 2px;
`;

const Hint = styled.p`
  color: #8a8a8a;
  font-size: 17px;
  margin: 0;
`;

export default function TvLoginPage() {
  const router = useRouter();
  const [started, setStarted] = React.useState<Started | null>(null);
  const [status, setStatus] = React.useState<"loading" | "pending" | "expired" | "error">(
    "loading"
  );

  const start = React.useCallback(async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/tv/auth/start", { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data?.code) {
        setStatus("error");
        return;
      }
      setStarted(data);
      setStatus("pending");
    } catch {
      setStatus("error");
    }
  }, []);

  React.useEffect(() => {
    start();
  }, [start]);

  /* Опрос статуса: как только телефон подтвердил — сессия уже в cookie,
     остаётся перезагрузить страницу, чтобы шапка показала имя */
  React.useEffect(() => {
    if (status !== "pending" || !started?.code) return;

    const timer = window.setInterval(async () => {
      try {
        const response = await fetch(
          `/api/tv/auth/status?code=${encodeURIComponent(started.code)}`,
          { cache: "no-store" }
        );
        const data = await response.json();

        if (data?.status === "ok") {
          window.clearInterval(timer);
          router.replace("/tv");
          router.refresh();
        } else if (data?.status === "expired" || data?.status === "unknown") {
          window.clearInterval(timer);
          setStatus("expired");
        }
      } catch {
        undefined;
      }
    }, 2000);

    return () => window.clearInterval(timer);
  }, [status, started, router]);

  return (
    <main>
      <h1 style={{ margin: "0 0 8px", fontSize: 34 }}>Вход через Telegram</h1>

      {status === "pending" && started ? (
        <>
          <Hint>Отсканируйте QR телефоном — или откройте ссылку и введите код.</Hint>

          <Wrap>
            {started.qr ? (
              <QrBox dangerouslySetInnerHTML={{ __html: started.qr }} />
            ) : null}

            <Steps>
              <ol>
                <li>Откройте камеру на телефоне и наведите на QR.</li>
                <li>Перейдите по ссылке — откроется наша страница.</li>
                <li>Нажмите «Подтвердить вход» на телефоне.</li>
              </ol>

              <div>
                <Hint>Или введите код вручную:</Hint>
                <Code>{started.code}</Code>
                <Hint>{started.link}</Hint>
              </div>

              <Hint>Ждём подтверждения… Экран обновится сам.</Hint>
            </Steps>
          </Wrap>
        </>
      ) : null}

      {status === "loading" ? <Hint>Готовлю код…</Hint> : null}

      {status === "expired" ? (
        <>
          <Hint>Код устарел. Это нормально: он живёт 15 минут.</Hint>
        </>
      ) : null}

      {status === "error" ? <Hint>Не получилось создать код. Попробуйте ещё раз.</Hint> : null}

      <TvRow style={{ marginTop: 34 }}>
        <div style={{ display: "flex", gap: 16 }} data-tv-row>
          {status !== "pending" ? (
            <TvAction data-tv-focus onClick={start}>
              Получить новый код
            </TvAction>
          ) : null}
          <TvAction data-tv-focus onClick={() => router.push("/tv")}>
            Назад
          </TvAction>
        </div>
      </TvRow>
    </main>
  );
}
