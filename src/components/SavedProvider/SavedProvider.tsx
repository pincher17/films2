"use client";

import React from "react";

/**
 * Состояние «сохранённого» на клиенте.
 *
 * Список загружается один раз, а карточки просто спрашивают «это сохранено?».
 * Иначе каждая карточка на странице делала бы свой запрос — на каталоге это
 * сотни запросов.
 *
 * Нажатие меняет состояние сразу (оптимистично) и подтверждается сервером.
 * Если сервер не ответил — возвращаем как было, чтобы значок не врал.
 */

type SavedContextValue = {
  ready: boolean;
  isSaved: (id: string | number) => boolean;
  toggle: (id: string | number) => Promise<void>;
  refresh: () => Promise<void>;
};

const SavedContext = React.createContext<SavedContextValue | null>(null);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = React.useState<Set<string>>(() => new Set());
  const [ready, setReady] = React.useState(false);

  const refresh = React.useCallback(async () => {
    try {
      const response = await fetch("/api/saved", { cache: "no-store" });
      const data = await response.json();
      setIds(new Set<string>((data?.docs || []).map((item: { id: string | number }) => String(item.id))));
    } catch {
      // сеть недоступна — оставляем текущее состояние, интерфейс не ломаем
    } finally {
      setReady(true);
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const isSaved = React.useCallback((id: string | number) => ids.has(String(id)), [ids]);

  const toggle = React.useCallback(
    async (id: string | number) => {
      const key = String(id);
      const wasSaved = ids.has(key);

      setIds((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.delete(key);
        else next.add(key);
        return next;
      });

      try {
        const response = wasSaved
          ? await fetch(`/api/saved?filmId=${encodeURIComponent(key)}`, { method: "DELETE" })
          : await fetch("/api/saved", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ filmId: key }),
            });
        if (!response.ok) throw new Error("не сохранено");
      } catch {
        // откат: показываем то, что есть на самом деле
        setIds((prev) => {
          const next = new Set(prev);
          if (wasSaved) next.add(key);
          else next.delete(key);
          return next;
        });
      }
    },
    [ids]
  );

  const value = React.useMemo(
    () => ({ ready, isSaved, toggle, refresh }),
    [ready, isSaved, toggle, refresh]
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved() {
  const context = React.useContext(SavedContext);
  if (!context) {
    // безопасный запасной вариант: если провайдер забыли подключить,
    // интерфейс продолжит работать, просто без сохранения
    return {
      ready: false,
      isSaved: () => false,
      toggle: async () => undefined,
      refresh: async () => undefined,
    } as SavedContextValue;
  }
  return context;
}
