import styled from 'styled-components'
import { Swiper } from 'swiper/react'

import arrowNext from '../../assets/icons/arrowNext.svg'
import arrowNextHover from '../../assets/icons/arrowNextHover.svg'
import arrowPrev from '../../assets/icons/arrowPrev.svg'
import arrowPrevHover from '../../assets/icons/arrowPrevHover.svg'

export const WrapperSlide = styled('div')`
  padding: 20px 0px;
 
`
export const Title = styled('p')`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 0px;
  margin-top: 24px;
`
export const Wrapper = styled('div')`
  padding: 0px 24px;
`
export const StyledSlider = styled(Swiper)`
  /* padding: 0px 18px 0px 18px; */
  @media screen and (max-width: 1024px) {
      padding: 0;
    }
  & > div.swiper-button-next {
    background-image: url('/arrowNext.svg');
    background-repeat: no-repeat;
    background-size: 50% auto;
    background-position: center;
    width: 44px;
    height: 44px;
    background-color: #747474;
    border-radius: 50%;
    -webkit-box-shadow: 0px 4px 11px 0px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0px 4px 11px 0px rgba(0, 0, 0, 0.2);
    box-shadow: 0px 4px 11px 0px rgba(0, 0, 0, 0.2);
    @media screen and (max-width: 850px) {
      display: none; 
    }
    margin-top: calc(0px - (var(--swiper-navigation-size)/ .6));
  }

  & > div.swiper-button-next:hover {
    background-image: url('/arrowNextHover.svg');
    background-repeat: no-repeat;
    background-size: 50% auto;
    background-position: center;
    width: 44px;
    height: 44px;
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
    width: 44px;
    height: 44px;
    background-color: #747474;
    border-radius: 50%;
    -webkit-box-shadow: 0px 4px 11px 0px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0px 4px 11px 0px rgba(0, 0, 0, 0.2);
    box-shadow: 0px 4px 11px 0px rgba(0, 0, 0, 0.2);
    @media screen and (max-width: 850px) {
      display: none; 
    }
    margin-top: calc(0px - (var(--swiper-navigation-size)/ .6));
  }

  & > div.swiper-button-prev:hover {
    background-image: url('/arrowPrevHover.svg');
    background-repeat: no-repeat;
    background-size: 50% auto;
    background-position: center;
    width: 44px;
    height: 44px;
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
export const Loader = styled('div')`
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`