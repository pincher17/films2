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

/* Когда открыт плеер, он помечает себя data-tv-scope: фокус не должен
   уезжать на элементы страницы под ним — иначе подсветка «пропадает» */
function activeScope(): Element | null {
  const scopes = Array.from(document.querySelectorAll("[data-tv-scope]"));
  return scopes.length ? scopes[scopes.length - 1] : null;
}

function visibleFocusables() {
  const scope = activeScope();
  const root: ParentNode = scope || document;
  return Array.from(root.querySelectorAll<HTMLElement>(`[${ATTR}]`)).filter((element) => {
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

  if (horizontal) {
    const { x, y, box } = centerOf(current);
    const lineTolerance = Math.max(24, box.height * 0.6);

    /* Сначала ищем соседа на той же линии — в том числе в соседней колонке.
       Это даёт переход с конца ряда букв в цифровой блок и обратно, вместо
       прыжка в ряд выше, который просто оказался ближе по диагонали. */
    let best: { element: HTMLElement; score: number } | null = null;

    for (const element of visibleFocusables()) {
      if (element === current) continue;
      const point = centerOf(element);
      const dx = point.x - x;
      const dy = Math.abs(point.y - y);
      if (dy > lineTolerance) continue;
      if (direction === "left" ? dx > -4 : dx < 4) continue;
      const score = Math.abs(dx);
      if (!best || score < best.score) best = { element, score };
    }

    if (best) return best.element;
    /* Внутри ряда дальше идти некуда — стоим на месте. Иначе с последней
       клавиши улетало в шапку по диагонали. */
    if (currentRow) return null;
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
      const targetRows = (
        direction === "down" ? allRows.slice(index + 1) : allRows.slice(0, index).reverse()
      ).filter((row) =>
        rowItems(row).some((element) => {
          const point = centerOf(element);
          return direction === "down"
            ? point.y > centerOf(current).y + 4
            : point.y < centerOf(current).y - 4;
        })
      );

      /* Ряды могут стоять колонками (например, буквы и цифры на клавиатуре).
         Тогда «вниз» должно вести в ряд, который перекрывает нас по
         горизонтали, а не в соседний по разметке. */
      const currentBox = current.getBoundingClientRect();
      const overlaps = targetRows.filter((row) =>
        rowItems(row).some((element) => {
          const box = element.getBoundingClientRect();
          return box.left < currentBox.right && box.right > currentBox.left;
        })
      );
      const ordered = overlaps.length ? overlaps : targetRows;
      const targetRow = ordered.find((row) =>
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

const FOCUS_CLASS = "tv-focused";

function focusElement(element: HTMLElement) {
  /* Класс дублирует :focus намеренно. На части телевизоров документ не получает
     фокус окна, и :focus тогда не срабатывает — подсветка пропадает. */
  document.querySelectorAll(`.${FOCUS_CLASS}`).forEach((node) => node.classList.remove(FOCUS_CLASS));
  element.classList.add(FOCUS_CLASS);
  element.focus({ preventScroll: true });
  element.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
}

export default function TvNav() {
  React.useEffect(() => {
    document.body.classList.add("tv-body");

    /* Пока человек не нажал ни одной клавиши, фокус «переезжает» на контент,
       как только он появился: иначе на главной он остаётся на логотипе. */
    let userMoved = false;

    const focusFirst = (force = false) => {
      const active = document.activeElement as HTMLElement | null;
      const activeInRow = Boolean(active?.closest?.("[data-tv-row]"));
      if (active?.hasAttribute(ATTR) && activeInRow) return;
      if (active?.hasAttribute(ATTR) && !force) return;
      const all = visibleFocusables();
      /* Приоритет — контенту: на телевизоре курсор должен стоять на первой
         карточке, а не на логотипе в шапке */
      const inRows = all.filter((element) => element.closest("[data-tv-row]"));
      const target = inRows[0] || all[0];
      if (target) focusElement(target);
    };

    /* Данные приезжают позже первого рендера. Ждём появления элементов и
       ставим фокус на первый — иначе пульт «не работает», пока не нажмёшь
       стрелку. Наблюдаем за DOM, а не по таймеру: ряд может появиться и через
       десять секунд на медленном телевизоре. */
    /* Появился плеер (или закрылся) — переводим фокус в его область, иначе
       подсветка остаётся на странице под ним и «пропадает» */
    let lastScope: Element | null = null;
    let returnFocus: HTMLElement | null = null;

    const syncScope = () => {
      const scope = activeScope();
      if (scope === lastScope) return;

      if (scope) {
        /* Запоминаем, откуда пришли — вернёмся туда после закрытия */
        const active = document.activeElement as HTMLElement | null;
        if (active?.hasAttribute(ATTR)) returnFocus = active;
        const [first] = visibleFocusables();
        if (first) focusElement(first);
      } else if (returnFocus && document.contains(returnFocus)) {
        focusElement(returnFocus);
        returnFocus = null;
      }

      lastScope = scope;
    };

    const observer = new MutationObserver(() => {
      syncScope();
      const active = document.activeElement as HTMLElement | null;
      if (!active?.hasAttribute(ATTR)) focusFirst();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    /* И на всякий случай один таймер: если разметка есть сразу */
    const retry = window.setInterval(() => {
      syncScope();
      const active = document.activeElement as HTMLElement | null;
      if (active?.hasAttribute(ATTR) && active.closest?.("[data-tv-row]")) {
        window.clearInterval(retry);
        return;
      }
      focusFirst(true);
    }, 500);

    const onKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      userMoved = true;
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
    const onBlur = () => {
      /* Ушли из элемента — снимаем подсветку, чтобы не висела */
      window.setTimeout(() => {
        const active = document.activeElement as HTMLElement | null;
        if (!active?.hasAttribute(ATTR)) {
          document.querySelectorAll(`.${FOCUS_CLASS}`).forEach((node) => node.classList.remove(FOCUS_CLASS));
        }
      }, 0);
    };
    window.addEventListener("blur", onBlur, true);

    window.addEventListener("keydown", onKeyDown, true);

    /* Мышь на телевизоре не нужна, но если она есть — пусть фокус следует за ней */
    const onPointer = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest?.(`[${ATTR}]`);
      if (target instanceof HTMLElement) target.focus({ preventScroll: true });
    };
    window.addEventListener("pointermove", onPointer);

    return () => {
      window.clearInterval(retry);
      observer.disconnect();
      window.removeEventListener("blur", onBlur, true);
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("pointermove", onPointer);
      document.body.classList.remove("tv-body");
    };
  }, []);

  return null;
}
