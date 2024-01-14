import React, { useEffect, useRef } from "react";
import { CrossIconFilm, Iframe, Wrapper, WrapperIframeMobile } from "../../app/styles/MobileWatchFilm.styles";
import { MobileWatchFilmProps } from "./MobileWatchFilm.types";
import { useAppDispatch } from "@/redux/hooks";
import { getFilmById } from "@/redux/filmInfoSlice";
import { Line1, Line2 } from "@/app/styles/AllFilmsPage.styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

const MobileWatchFilm: React.FC<MobileWatchFilmProps> = ({id, setWatchFilm}) => {
  const dispatch = useAppDispatch()
  const refDataFilm = useRef<HTMLInputElement | null>(null);

  const toggleWatchFilm = () => setWatchFilm(false)

  const [value, setValue] = React.useState("one");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

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
    <CrossIconFilm sidebar={(+true)} onClick={toggleWatchFilm}>
          <Line1 />
          <Line2 />
        </CrossIconFilm>
      <WrapperIframeMobile key={id.toString()}>
              {/* <div key={id + id} className={s.film} ref={refDataFilm} id="yohoho" data-tv="1" ></div> */}
             {value === "two" ? <Iframe src={`https://vb17123filippaaniketos.pw/play/${id}/iframe?d=filmhub.lol`} frameBorder="0" scrolling="no" allowFullScreen referrerPolicy="origin" width="500" height="352"></Iframe>
             : <Iframe src={`https://unsightly-lock.cdnmovies-stream.online/kinopoisk/${id}/iframe?domain=filmhub.lol`} frameBorder="0" scrolling="no" allowFullScreen referrerPolicy="origin" width="500" height="352"></Iframe>
             }
              <Box sx={{ width: "100%" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  textColor="inherit"
                  aria-label="secondary tabs example"
                  TabIndicatorProps={{
                    style: {
                      backgroundColor: "#d41515"
                    }
                  }}
                >
                  <Tab value="one" label="Плеер 1" />
                  <Tab value="two" label="Плеер 2" />
                </Tabs>
              </Box>
            </WrapperIframeMobile>
    </Wrapper>
  )
};

export default MobileWatchFilm;
