/**
 * Канонический адрес карточки фильма.
 *
 * У страницы два вида адреса: короткий `/film/460586` и полный
 * `/film/460586-pacany-2019`. Полный попадает в карту сайта и в canonical,
 * короткий — во внутренние ссылки и в старые закладки. Чтобы Google не считал
 * их разными страницами, короткий 301-редиректом ведёт на полный.
 *
 * У фильмов без кинопоискового id адрес строится от imdb (`tt...`). Для них
 * оставляем короткий вид: слаг к `tt`-номеру ничего не добавляет, а в карте
 * сайта таких адресов всё равно нет.
 */
import textTransform from "./textTransform";

type FilmLike = { name?: string | null; year?: number | null } | null | undefined;

export default function filmPath(id: string | number) {
  const cleanId = String(id || "");
  return `/film/${cleanId}`;
}
