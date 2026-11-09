import { NextResponse, type NextRequest } from "next/server";

/**
 * Две задачи middleware.
 *
 * 1. Короткий адрес фильма: /film/460586 вместо /film/460586-pacany-2019.
 *    Слаг в адресе ничего не решает: любой текст после номера открывал ту же
 *    страницу, и для поиска это были дубли одной карточки. Канонический адрес
 *    теперь короткий, а всё со слагом отдаёт постоянный 301.
 *    Редирект делаем здесь, а не в странице: страница уже отдаёт HTML потоком,
 *    и оттуда Next успевает прислать только meta-refresh.
 *
 * 2. Телевизор: у пульта нет курсора, поэтому телевизору отдаём отдельную
 *    версию — /tv, управление стрелками. Определяем по User-Agent, плюс
 *    ?tv=1 для проверки на компьютере.
 */
const TV_UA =
  /(smart-?tv|smarttv|tizen|web0s|webos|netcast|hbbtv|viera|aquos|bravia|android ?tv|google ?tv|appletv|apple tv|roku|crkey|xbox|playstation|opera tv|dtv|pov_tv|googletv|mibox|shield)/i;

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  /* --- фильм со слагом → короткий адрес --- */
  const filmMatch = pathname.match(/^\/film\/((?:tt)?\d+)-[^/]+$/i);
  if (filmMatch) {
    const url = request.nextUrl.clone();
    url.pathname = `/film/${filmMatch[1]}`;
    return NextResponse.redirect(url, 301);
  }

  /* --- телевизор → отдельная версия --- */
  /* ?tv=0 — выключить режим и вернуться на обычный сайт (нужно для проверки) */
  if (searchParams.get("tv") === "0") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    const response = NextResponse.redirect(url);
    response.cookies.delete("fh_tv");
    return response;
  }

  const forced = searchParams.get("tv") === "1";
  const tv =
    forced ||
    TV_UA.test(request.headers.get("user-agent") || "") ||
    request.cookies.get("fh_tv")?.value === "1";

  if (tv && !pathname.startsWith("/tv") && !pathname.startsWith("/api")) {
    const url = request.nextUrl.clone();
    url.pathname = "/tv";
    url.search = "";
    const response = NextResponse.redirect(url);
    /* Запоминаем режим, чтобы внутренние переходы его не теряли */
    response.cookies.set("fh_tv", "1", { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/film/:path*", "/", "/films", "/series", "/cartoons", "/search/:path*"],
};
