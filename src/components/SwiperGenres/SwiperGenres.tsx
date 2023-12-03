/* eslint-disable import/no-unresolved */
import React from "react";

// import required modules

import { SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";

import {
  StyledSlider,
  Wrapper,
  WrapperSlide,
} from "../../app/styles/SwiperFilms.styles";
import { Mousewheel, Navigation } from "swiper/modules";
import { allGenres } from "@/data/allGenres";
import GenreButton from "../GenreButton/GenreButton";
import { SwiperGenresProps } from "./SwiperGenres.types";
import { StyledSliderGenres } from "@/app/styles/SwiperGenres.styles";
import Link from "next/link";
import { Title, WrapperGenre } from "../GenreButton";

const SwiperGenres: React.FC<SwiperGenresProps> = () => {


  return (
    <>
      <StyledSliderGenres
        cssMode={true}
        mousewheel={true}
        slidesPerView={2.3}
        slidesPerGroup={2}
        spaceBetween={7}
        modules={[Navigation, Mousewheel]}
        className="mySwiper"
        speed={500}
        navigation
        breakpoints={{
          577: { slidesPerGroup: 3, slidesPerView: 3.5, spaceBetween: 15 },
          769: { slidesPerGroup: 3, slidesPerView: 4, spaceBetween: 30 },
          1024: { slidesPerGroup: 3, slidesPerView: 6, spaceBetween: 30 },
          1200: { slidesPerGroup: 3, slidesPerView: 6, spaceBetween: 30 },
        }}
      >

<Wrapper>
        {
        allGenres.map((item) => (
          <SwiperSlide key={item.id}>
            <WrapperSlide>
                <GenreButton title={item.value} key={item.value}/>
            </WrapperSlide>
          </SwiperSlide>
        ))
        }
      </Wrapper>
    </StyledSliderGenres>
    </>
  )
}

export default SwiperGenres;