/* eslint-disable import/no-unresolved */
import React from "react";

// import required modules

import { SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";

import {
  Loader,
  StyledSlider,
  Title,
  Wrapper,
  WrapperSlide,
} from "../../app/styles/SwiperFilms.styles";
import Card from "../Card";
import { SwiperFilmsProps } from "./SwiperFilms.types";
import SkeletonCard from "../SkeletonCard/SkeletonCard";
import { useAppSelector } from "@/redux/hooks";
import { Mousewheel, Navigation } from "swiper/modules";
import { Spinner } from "../spinner/Spinner";

const SwiperFilms: React.FC<SwiperFilmsProps> = ({ cards, title }) => {
  const arraySkeletonCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  /* const onSwiper = (swiper: SwiperClass) => {
		setTimeout(() => {
      // @ts-ignore
      swiper.params.navigation.prevEl = navigationPrevRef.current;
      // @ts-ignore
      swiper.params.navigation.nextEl = navigationNextRef.current;
			// Re-init navigation
			swiper.navigation.destroy();
			swiper.navigation.init();
			swiper.navigation.update();
		});
	}; */

  return (
    <>
      {cards.length ? <Title>{title}</Title> : ""}
      <StyledSlider
        cssMode={true}
        mousewheel={true}
        slidesPerView={2.5}
        slidesPerGroup={2}
        spaceBetween={10}
        modules={[Navigation, Mousewheel]}
        className="mySwiper"
        speed={500}
        navigation
        breakpoints={{
          577: { slidesPerGroup: 3, slidesPerView: 3, spaceBetween: 15 },
          769: { slidesPerGroup: 3, slidesPerView: 3, spaceBetween: 30 },
          1024: { slidesPerGroup: 4, slidesPerView: 4, spaceBetween: 30 },
          1200: { slidesPerGroup: 5, slidesPerView: 5, spaceBetween: 30 },
        }}
      >

<Wrapper>
        {cards.length ?
        cards.map((item) => (
          <SwiperSlide key={item.id}>
            <WrapperSlide>
                <Card card={item} key={item.id}/>
                
            </WrapperSlide>
          </SwiperSlide>
        ))
        : 
            <Loader>
            <Spinner strokeWidth={2} />
            </Loader>
        }
      </Wrapper>
    </StyledSlider>
    </>
  )
}

export default SwiperFilms;