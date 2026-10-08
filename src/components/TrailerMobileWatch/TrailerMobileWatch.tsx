import React from "react";
import { CrossIconFilm, Iframe, Wrapper } from "../../app/styles/TrailerMobileWatch.styles";
import { MobileWatchFilmProps } from "./TrailerMobileWatch.types";
import { WrapperIframeMobile } from "../../app/styles/MobileWatchFilm.styles";
import { Line1, Line2 } from "@/app/styles/AllFilmsPage.styles";

const TrailerMobileWatch: React.FC<MobileWatchFilmProps> = ({id, setWatchTrailer, src}) => {

  const toggleWatchFilm = () => setWatchTrailer(false);

  /*
   * Запасной путь: на телефоне YouTube иногда отказывается играть во врезке
   * (строгие правила iOS для чужих iframe). Ссылка на обычную страницу
   * выручает в этом случае.
   */
  const watchUrl = src
    ? src.replace("youtube-nocookie.com/embed/", "youtube.com/watch?v=").replace("/embed/", "/watch?v=").split("&")[0].split("?")[0]
    : null;


  return (
    // метка для WatchTracker: пока открыт трейлер, время фильма не идёт
    <Wrapper data-trailer-open="true">
    <CrossIconFilm sidebar={(+true)} onClick={toggleWatchFilm}>
          <Line1 />
          <Line2 />
        </CrossIconFilm>
      <WrapperIframeMobile key={id.toString()}>
              {src && <Iframe 
                src={src}
                frameBorder="0"
                scrolling="no"
                allowFullScreen
                referrerPolicy="origin"></Iframe>}
            </WrapperIframeMobile>
      {watchUrl ? (
        <a
          href={watchUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "block",
            margin: "16px 12px 0",
            textAlign: "center",
            fontSize: 14,
            color: "rgba(248,248,248,0.55)",
            textDecoration: "none",
          }}
        >
          Трейлер не играет? Открыть на YouTube →
        </a>
      ) : null}
    </Wrapper>
  )
};

export default TrailerMobileWatch;
