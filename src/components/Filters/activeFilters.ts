/**
 * Какие фильтры отличаются от значений по умолчанию.
 *
 * Нужно для двух вещей: счётчик у иконки фильтров и чипы в панели.
 * Если всё по умолчанию — список пуст, и ничего не показываем.
 */
export type ActiveFilterChip = { key: string; label: string };

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
    chips.push({ key: "genre", label: `Жанров: ${filters.genre.length}` });
  }

  if (Array.isArray(filters?.country) && filters.country.length) {
    chips.push({ key: "country", label: `Стран: ${filters.country.length}` });
  }

  const selected = filters?.selectedTypeOfMovies;
  if (Array.isArray(selected) && selected.length) {
    chips.push({ key: "type", label: selected.join(", ") });
  }

  return chips;
}
