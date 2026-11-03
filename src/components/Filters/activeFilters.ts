/**
 * Какие фильтры отличаются от значений по умолчанию.
 *
 * Нужно для чипов на странице каталога и счётчика у иконки фильтров.
 * Если всё по умолчанию — список пуст, и ничего не показываем.
 */
export type ActiveFilterChip = { key: string; label: string };

const TYPE_NAMES: Record<string, string> = {
  "1": "Фильмы",
  "2": "Сериалы",
  "3": "Мультфильмы",
};

const ALL_TYPES = ["1", "2", "3"];

/* Значение фильтра может прийти массивом, объектом или строкой —
   приводим к массиву, иначе часть фильтров терялась (например страны). */
const toArray = (value: any): any[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

/** Названия выбранных элементов: поддерживаем и строки, и { label } */
const labelsOf = (items: any[]): string[] =>
  items
    .map((item) => (item && typeof item === "object" ? item.label ?? item.value : item))
    .filter(Boolean)
    .map(String);

export function getActiveFilterChips(filters: any): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  const rating = filters?.rating;
  if (Array.isArray(rating) && (Number(rating[0]) !== 1 || Number(rating[1]) !== 10)) {
    chips.push({ key: "rating", label: `Рейтинг ${rating[0]}–${rating[1]}` });
  }

  const year = filters?.year;
  if (Array.isArray(year) && (Number(year[0]) !== 1960 || Number(year[1]) !== 2026)) {
    chips.push({ key: "year", label: `Годы ${year[0]}–${year[1]}` });
  }

  // в каталоге поле называется genre, в фильтрах студий — genres
  const genres = toArray(filters?.genre ?? filters?.genres);
  if (genres.length) {
    const names = labelsOf(genres);
    chips.push({ key: "genre", label: names.length ? names.join(", ") : `Жанров: ${genres.length}` });
  }

  /* Страны: по умолчанию выбрано «Все» (value === ""), тогда ничего не пишем. */
  const chosenCountries = toArray(filters?.country).filter(
    (item: any) => item && (typeof item === "string" ? item !== "" : item.value !== "")
  );
  if (chosenCountries.length) {
    const names = labelsOf(chosenCountries);
    if (names.length) chips.push({ key: "country", label: names.join(", ") });
  }

  /* Тип контента чипом не показываем: в разделах каталога он и так очевиден
     из заголовка и переключателя, а чип только дублировал его. */

  return chips;
}
