import { FilmInfoType } from "../../types/film"

export interface FilmInfoTextProps {
  filmInfoId: FilmInfoType | null
  countries: Array<any>
  genres: Array<any>
  ratingKinopoisk: number | null
  resolution: any
}
