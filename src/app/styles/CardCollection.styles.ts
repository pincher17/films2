import styled from 'styled-components'
import { Img, NameFilm } from './Card.styles'

export const ImageCollection = styled(Img)`
    height: 75%;
`

export const NameCollection = styled(NameFilm)`
    margin-top: -65px;
    @media (max-width: 450px){
        margin-top: -40px;
  }
`