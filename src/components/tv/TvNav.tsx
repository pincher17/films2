"use client";

/**
 * Навигация пультом.
 *
 * На телевизоре нет курсора: перемещение — стрелки, выбор — Enter, назад —
 * Backspace или кнопка «Назад» на пульте браузера. Работаем с настоящим
 * DOM-фокусом: любой элемент с атрибутом data-tv-focus становится доступным.
 *
 * Куда двигаться, решает геометрия: из всех элементов в нужную сторону
 * выбирается ближайший, а «сосед по строке» ценится выше, чем «через три
 * ряда» — за счёт веса поперечного смещения.
 */

import React from "react";

const ATTR = "data-tv-focus";

type Direction = "up" | "down" | "left" | "right";

function visibleFocusables() {
  return Array.from(document.querySelectorAll<HTMLElement>(`[${ATTR}]`)).filter((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return false;
    const style = window.getComputedStyle(element);
    return style.visibility !== "hidden" && style.display !== "none" && style.opacity !== "0";
  });
}

const ROW_ATTR = "data-tv-row";

function rowOf(element: HTMLElement | null) {
  return element ? element.closest(`[${ROW_ATTR}]`) : null;
}

function rowItems(row: Element | null) {
  if (!row) return [];
  return visibleFocusables().filter((element) => rowOf(element) === row);
}

function centerOf(element: HTMLElement) {
  const box = element.getBoundingClientRect();
  return { x: box.left + box.width / 2, y: box.top + box.height / 2, box };
}

function pickNext(current: HTMLElement, direction: Direction) {
  const currentRow = rowOf(current);
  const horizontal = direction === "left" || direction === "right";

  if (horizontal && currentRow) {
    /* Внутри ряда — просто ближайший сосед по горизонтали */
    const { x, y } = centerOf(current);
    let best: { element: HTMLElement; score: number } | null = null;

    for (const element of rowItems(currentRow)) {
      if (element === current) continue;
      const point = centerOf(element);
      const dx = point.x - x;
      const dy = Math.abs(point.y - y);
      if (dy > 60) continue;
      if (direction === "left" ? dx > -4 : dx < 4) continue;
      const score = Math.abs(dx) + dy * 2;
      if (!best || score < best.score) best = { element, score };
    }

    if (best) return best.element;
  }

  if (!horizontal) {
    /* Вверх-вниз — переход между рядами: берём соседний ряд и в нём ближайший
       по горизонтали элемент. Так с любой кнопки вниз попадаешь в следующий
       ряд, а не в тот, что случайно оказался ближе по диагонали. */
    const allRows = Array.from(document.querySelectorAll(`[${ROW_ATTR}]`)).filter(
      (row) => rowItems(row).length > 0
    );
    const index = currentRow ? allRows.indexOf(currentRow) : -1;
    if (index >= 0) {
      const targetRows = direction === "down" ? allRows.slice(index + 1) : allRows.slice(0, index).reverse();
      const targetRow = targetRows.find((row) =>
        rowItems(row).some((element) => {
          const point = centerOf(element);
          return direction === "down"
            ? point.y > centerOf(current).y + 4
            : point.y < centerOf(current).y - 4;
        })
      );

      if (targetRow) {
        const { x } = centerOf(current);
        const candidates = rowItems(targetRow)
          .filter((element) => {
            const point = centerOf(element);
            return direction === "down"
              ? point.y > centerOf(current).y + 4
              : point.y < centerOf(current).y - 4;
          })
          .sort((a, b) => Math.abs(centerOf(a).x - x) - Math.abs(centerOf(b).x - x));

        if (candidates.length) return candidates[0];
      }
    }
  }

  /* Запасной путь — по геометрии, если ряды не размечены */
  const { x: cx, y: cy } = centerOf(current);
  let best: { element: HTMLElement; score: number } | null = null;

  for (const element of visibleFocusables()) {
    if (element === current) continue;
    const point = centerOf(element);
    const dx = point.x - cx;
    const dy = point.y - cy;
    const forward =
      direction === "left"
        ? dx < -4
        : direction === "right"
        ? dx > 4
        : direction === "up"
        ? dy < -4
        : dy > 4;
    if (!forward) continue;

    const along = Math.abs(horizontal ? dx : dy);
    const across = Math.abs(horizontal ? dy : dx);
    const score = along * 2 + across;
    if (!best || score < best.score) best = { element, score };
  }

  return best?.element || null;
}

function focusElement(element: HTMLElement) {
  element.focus({ preventScroll: true });
  element.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
}

export default function TvNav() {
  React.useEffect(() => {
    document.body.classList.add("tv-body");

    const focusFirst = () => {
      const [first] = visibleFocusables();
      if (first && !document.activeElement?.hasAttribute(ATTR)) focusElement(first);
    };

    /* Данные приезжают позже первого рендера: несколько секунд подряд
       пробуем поставить фокус на первую карточку, иначе пульт «не работает» */
    let tries = 0;
    const retry = window.setInterval(() => {
      tries += 1;
      const active = document.activeElement as HTMLElement | null;
      if (active?.hasAttribute(ATTR)) {
        window.clearInterval(retry);
        return;
      }
      focusFirst();
      if (tries > 20) window.clearInterval(retry);
    }, 300);

    const onKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      const arrows = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", " ", "Backspace"];
      if (!arrows.includes(key)) return;

      const active = document.activeElement as HTMLElement | null;
      const hasFocus = active?.hasAttribute(ATTR);

      if (key === "Backspace") {
        event.preventDefault();
        window.history.back();
        return;
      }

      if (!hasFocus) {
        event.preventDefault();
        focusFirst();
        return;
      }

      if (key === "Enter" || key === " ") {
        event.preventDefault();
        active?.click();
        return;
      }

      const direction = key.replace("Arrow", "").toLowerCase() as Direction;
      const next = pickNext(active!, direction);
      event.preventDefault();
      if (next) focusElement(next);
    };

    /* Перехватываем до страницы: иначе стрелки прокручивают список */
    window.addEventListener("keydown", onKeyDown, true);

    /* Мышь на телевизоре не нужна, но если она есть — пусть фокус следует за ней */
    const onPointer = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest?.(`[${ATTR}]`);
      if (target instanceof HTMLElement) target.focus({ preventScroll: true });
    };
    window.addEventListener("pointermove", onPointer);

    return () => {
      window.clearInterval(retry);
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("pointermove", onPointer);
      document.body.classList.remove("tv-body");
    };
  }, []);

  return null;
}
