import React, { useEffect, useRef } from "react";
import { CrossIconFilm, Iframe, Wrapper, WrapperIframeMobile } from "../../app/styles/MobileWatchFilm.styles";
import { MobileWatchFilmProps } from "./MobileWatchFilm.types";
import { useAppDispatch } from "@/redux/hooks";
import { getFilmById } from "@/redux/filmInfoSlice";
import { Line1, Line2 } from "@/app/styles/AllFilmsPage.styles";

const MobileWatchFilm: React.FC<MobileWatchFilmProps> = ({id, setWatchFilm}) => {
  const dispatch = useAppDispatch()
  const refDataFilm = useRef<HTMLInputElement | null>(null);

  const toggleWatchFilm = () => setWatchFilm(false)

  useEffect(() => {
    dispatch(getFilmById(id))
    }, [id]);
  
    useEffect(() => {
      refDataFilm.current?.setAttribute("data-kinopoisk", `${id}`);
    }, [id]);

    useEffect(() => {
      const script = document.createElement("script");
      script.src = "//yohoho.cc/yo.js";
      document.body.appendChild(script);
    
      return () => {
        script.remove();
      };
      }, [id]);

  return (
    <Wrapper>
    <CrossIconFilm sidebar={true} onClick={toggleWatchFilm}>
          <Line1 />
          <Line2 />
        </CrossIconFilm>
      <WrapperIframeMobile key={id.toString()}>
              {/* <div key={id + id} className={s.film} ref={refDataFilm} id="yohoho" data-tv="1" ></div> */}
              <Iframe src={`https://v1687699810.bazon.site/kp/${id}?noads=1`} frameBorder="0" scrolling="no" allowFullScreen referrerPolicy="origin" width="500" height="352"></Iframe>
            </WrapperIframeMobile>
    </Wrapper>
  )
};

export default MobileWatchFilm;
