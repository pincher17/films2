import React from "react";
import { CrossIconFilm, Iframe, Wrapper } from "../../app/styles/TrailerMobileWatch.styles";
import { MobileWatchFilmProps } from "./TrailerMobileWatch.types";
import { WrapperIframeMobile } from "../../app/styles/MobileWatchFilm.styles";
import { Line1, Line2 } from "@/app/styles/AllFilmsPage.styles";

const TrailerMobileWatch: React.FC<MobileWatchFilmProps> = ({id, setWatchTrailer, src}) => {

  const toggleWatchFilm = () => setWatchTrailer(false)


  return (
    <Wrapper>
    <CrossIconFilm sidebar={true} onClick={toggleWatchFilm}>
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
    </Wrapper>
  )
};

export default TrailerMobileWatch;
