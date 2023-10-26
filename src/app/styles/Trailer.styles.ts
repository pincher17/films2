import styled from 'styled-components'
import { CrossIconFilm } from './MobileWatchFilm.styles'


export const IframeTrailer = styled('iframe')`
  width: 70% !important;
  height: 75% !important;
  position: fixed;
  top: 10%;
  left: 15%;
`

export const WrapperButtonTrailer = styled('div')`
 margin-bottom: 35px;
    margin-top: 15px;
    @media (max-width: 1150px){
      position: absolute;
      top: 640px;
  }
`
export const ButtonTrailer = styled('div')`
 background-color: rgb(184,22,22);
    color: rgb(235,235,235);
    font-weight: 500;
    font-size: 18px;
    cursor: pointer;
    -webkit-text-decoration: none;
    text-decoration: none;
    border: 1px solid rgb(184,22,22);
    border-radius: 5px;
    width: 360px;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
`
export const PopupTrailer = styled('div')`
  width: 75vw;
  height: 60vh;
`
export const CloseIconTrailer = styled(CrossIconFilm)`
  display: block;
  top: 10%;
  left: 88%;
`
export const Overlay = styled('div')`
  position: fixed; /* Sit on top of the page content */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5); /* Black background with opacity */
  z-index: 25; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer;
  -webkit-backdrop-filter: blur(1.5px);
  backdrop-filter: blur(1.5px);
`