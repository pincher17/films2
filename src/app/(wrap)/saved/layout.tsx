import type { Metadata } from "next";

/* Личная страница: в индексе ей делать нечего — контент зависит от пользователя */
export const metadata: Metadata = {
  title: "Сохранённое — Filmhub",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
