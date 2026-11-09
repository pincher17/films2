"use client";

/**
 * Кнопка входа через Telegram (Login Widget).
 *
 * Telegram сам отдаёт данные пользователя и подпись; мы отправляем их на свой
 * сервер, где подпись проверяется токеном бота. Только после этого выдаётся
 * сессия. Клиентской проверке доверять нельзя — она обходится.
 */

import React from "react";

declare global {
  interface Window {
    onTelegramAuth?: (user: Record<string, unknown>) => void;
  }
}

const TelegramLogin: React.FC<{ next?: string }> = ({ next = "/" }) => {
  const bot = process.env.NEXT_PUBLIC_TELEGRAM_BOT;

  React.useEffect(() => {
    if (!bot) return;

    window.onTelegramAuth = async (user) => {
      try {
        const response = await fetch("/api/auth/telegram", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(user),
        });
        if (response.ok) {
          // сессия выдана — уходим на главную, чтобы человек сразу видел
          // подборки и «Продолжить просмотр», а не оставался на странице входа
          window.location.href = next || "/";
        } else {
          const data = await response.json().catch(() => null);
          alert(data?.error || "Не удалось войти через Telegram");
        }
      } catch {
        alert("Сервер недоступен, попробуйте ещё раз");
      }
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", bot);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "10");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    document.getElementById("telegram-login")?.appendChild(script);

    return () => {
      script.remove();
    };
  }, [bot]);

  if (!bot) return null;

  return <div id="telegram-login" style={{ marginTop: 16 }} />;
};

export default TelegramLogin;
