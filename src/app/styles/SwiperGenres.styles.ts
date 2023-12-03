import styled from 'styled-components'
import { Swiper } from 'swiper/react'


export const StyledSliderGenres = styled(Swiper)`
  /* padding: 0px 18px 0px 18px; */
  margin-top: 25px;
  @media screen and (max-width: 1024px) {
      padding: 0;
    }
  & > div.swiper-button-next {
    background-image: url('/arrowNext.svg');
    background-repeat: no-repeat;
    background-size: 50% auto;
    background-position: center;
    width: 34px;
    height: 34px;
    background-color: #747474;
    border-radius: 50%;
    right: 0;
    top: 54px;
    -webkit-box-shadow: 0px 4px 11px 0px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0px 4px 11px 0px rgba(0, 0, 0, 0.2);
    box-shadow: 0px 4px 11px 0px rgba(0, 0, 0, 0.2);
    @media screen and (max-width: 850px) {
      display: none; 
    }
  }

  & > div.swiper-button-next:hover {
    background-image: url('/arrowNextHover.svg');
    background-repeat: no-repeat;
    background-size: 50% auto;
    background-position: center;
    background-color: #b81716;
    border-radius: 50%;
    -webkit-box-shadow: 0px 4px 11px 0px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0px 4px 11px 0px rgba(0, 0, 0, 0.2);
    box-shadow: 0px 4px 11px 0px rgba(0, 0, 0, 0.2);
  }

  & > .swiper-button-next::after {
    display: none;
  }

  & > div.swiper-button-prev {
    background-image: url('/arrowPrev.svg');
    background-repeat: no-repeat;
    background-size: 50% auto;
    background-position: center;
    width: 34px;
    height: 34px;
    background-color: #747474;
    border-radius: 50%;
    left: 0;
    top: 54px;
    -webkit-box-shadow: 0px 4px 11px 0px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0px 4px 11px 0px rgba(0, 0, 0, 0.2);
    box-shadow: 0px 4px 11px 0px rgba(0, 0, 0, 0.2);
    @media screen and (max-width: 850px) {
      display: none; 
    }
  }

  & > div.swiper-button-prev:hover {
    background-image: url('/arrowPrevHover.svg');
    background-repeat: no-repeat;
    background-size: 50% auto;
    background-position: center;
    background-color: #b81716;
    border-radius: 50%;
    -webkit-box-shadow: 0px 4px 11px 0px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0px 4px 11px 0px rgba(0, 0, 0, 0.2);
    box-shadow: 0px 4px 11px 0px rgba(0, 0, 0, 0.2);
  }

  & > .swiper-button-prev::after {
    display: none;
  }

`