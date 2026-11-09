import { NextResponse, type NextRequest } from "next/server";

/**
 * Короткий адрес фильма: /film/460586 вместо /film/460586-pacany-2019.
 *
 * Слаг в адресе ничего не решает: любой текст после номера открывал ту же
 * страницу, и для поиска это были дубли одной карточки. Канонический адрес
 * теперь короткий, а всё со слагом отдаёт постоянный 301.
 *
 * Редирект делаем здесь, а не в странице: страница уже отдаёт HTML потоком, и
 * оттуда Next успевает прислать только meta-refresh, а не HTTP-редирект.
 */
export function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/film\/((?:tt)?\d+)-[^/]+$/i);
  if (!match) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/film/${match[1]}`;
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: "/film/:path*",
};
