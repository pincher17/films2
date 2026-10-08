import React, { useEffect, useRef } from "react";
import { CrossIconFilm, Iframe, Wrapper, WrapperIframeMobile } from "../../app/styles/MobileWatchFilm.styles";
import { MobileWatchFilmProps } from "./MobileWatchFilm.types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getFilmById } from "@/redux/filmInfoSlice";
import { Line1, Line2 } from "@/app/styles/AllFilmsPage.styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import StreamPlayer from "../StreamPlayer/StreamPlayer";
import PlayerBridge from "../PlayerBridge/PlayerBridge";
import WatchTracker from "../WatchTracker/WatchTracker";
import { getFilmStreams } from "@/data/streams";

const MobileWatchFilm: React.FC<MobileWatchFilmProps> = ({id, setWatchFilm}) => {
  const dispatch = useAppDispatch()
  const streams = getFilmStreams(id);
  const refDataFilm = useRef<HTMLInputElement | null>(null);

  const toggleWatchFilm = () => setWatchFilm(false)

  const [value, setValue] = React.useState("one");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // Данные уже загружены страницей фильма. Повторный запрос отсюда возвращал
  // скелетон и закрывал плеер: попап монтируется → loading → скелетон →
  // попап размонтируется → загрузка завершается → попап монтируется снова.
  const filmInfo = useAppSelector((state) => state.filmInfo.info);

  useEffect(() => {
    if (!filmInfo?.name) dispatch(getFilmById(id));
  }, [id, filmInfo?.name]);

  
    useEffect(() => {
      refDataFilm.current?.setAttribute("data-kinopoisk", `${id}`);
    }, [id]);


  return (
    <Wrapper>
    <CrossIconFilm sidebar={(+true)} onClick={toggleWatchFilm}>
          <Line1 />
          <Line2 />
        </CrossIconFilm>
      <WrapperIframeMobile key={id.toString()}>
        {/* Контейнер, внутри которого PlayerBridge ищет встроенный плеер.
            Без него события прогресса на телефоне не читались вовсе. */}
        <div id="fh-player">
              {/* <div key={id + id} className={s.film} ref={refDataFilm} id="yohoho" data-tv="1" ></div> */}
             {streams ? (
               <StreamPlayer filmId={id} streams={streams} />
             ) : (
               <>
                 <Iframe sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups"
                     src={`https://api.ortified.ws/embed/kp/${id}`}
                     frameBorder="0"
                     scrolling="no"
                     allowFullScreen
                     referrerPolicy="origin"
                     width="500"
                     height="352"
                   ></Iframe>
               </>
             )}
                    </div>
        <PlayerBridge filmId={id} />
        <WatchTracker filmId={id} />
      </WrapperIframeMobile>
    </Wrapper>
  )
};

export default MobileWatchFilm;
