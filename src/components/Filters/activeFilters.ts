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

  if (Array.isArray(filters?.genre) && filters.genre.length) {
    const names = labelsOf(filters.genre);
    chips.push({ key: "genre", label: names.length ? names.join(", ") : `Жанров: ${filters.genre.length}` });
  }

  /* Страны: по умолчанию выбрано «Все» (value === ""), тогда ничего не пишем. */
  const country = Array.isArray(filters?.country) ? filters.country : [];
  const chosenCountries = country.filter((item: any) => item && item.value !== "");
  if (chosenCountries.length) {
    const names = labelsOf(chosenCountries);
    if (names.length) chips.push({ key: "country", label: names.join(", ") });
  }

  /* Тип: по умолчанию выбраны все три, тогда это дефолт и чипа быть не должно. */
  const selected = Array.isArray(filters?.selectedTypeOfMovies)
    ? filters.selectedTypeOfMovies.map(String)
    : [];
  const isDefaultTypes = selected.length === 3 && ALL_TYPES.every((type) => selected.includes(type));
  if (selected.length && !isDefaultTypes) {
    const names = selected.map((type: string) => TYPE_NAMES[type] || type);
    chips.push({ key: "type", label: names.join(", ") });
  }

  return chips;
}
