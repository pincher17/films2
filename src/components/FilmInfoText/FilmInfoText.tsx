import React from "react";
import {
  Description,
  Flex,
  MarginTopTitle,
  MarginTopValue,
  Name,
  NameTitle,
  TextValue,
  TitleDescription,
  ValueTextSpan,
} from "../../app/styles/FilmPage.styles";
import {
  MetaDesktopOnly,
  MetaMobileOnly,
  MobileGenre,
  MobileGenres,
  MobileMetaDot,
  MobileMetaRow,
  MobileRating,
} from "../../app/styles/FilmPageMobile.styles";
import { FilmInfoTextProps } from "./FilmInfoText.types";
import roundNumber from "../helpers/rounding";

/**
 * Метаданные фильма: название, страна, жанры, рейтинг.
 *
 * Вёрстка переключается средствами CSS, а не по JS-ширине окна: ширину мы
 * измеряем в useEffect, и на первом рендере она равна нулю — из-за этого
 * компактный вариант на телефоне не включался.
 */
const FilmInfoText: React.FC<FilmInfoTextProps> = (props) => {
  const { filmInfoId, countries, genres, ratingKinopoisk, resolution } = props;

  const ratingKp = roundNumber(ratingKinopoisk, 1);

  // ступень рейтинга для цвета бейджа — та же логика, что на карточках
  const ratingTier = !ratingKp
    ? "none"
    : ratingKp >= 8
    ? "top"
    : ratingKp >= 7
    ? "good"
    : ratingKp >= 6
    ? "mid"
    : ratingKp >= 5
    ? "weak"
    : "low";

  // строка на телефоне: год · длительность · страна
  const metaTexts = [
    filmInfoId?.year ? String(filmInfoId.year) : null,
    filmInfoId?.movieLength ? `${filmInfoId.movieLength} мин` : null,
    countries?.length
      ? countries.map((country: any) => country.name).join(", ")
      : null,
  ].filter(Boolean) as string[];

  return (
    <div>
      <Name itemProp="name">
        {filmInfoId?.name && (
          <>
            {filmInfoId.name}{" "}
            {filmInfoId.year ? `(${filmInfoId.year}\u00A0г.)` : ""}
          </>
        )}
      </Name>

      {/* Компьютер: прежний вид — подписи и значения строками */}
      <MetaDesktopOnly>
        <Flex>
          <NameTitle>Страна:&nbsp;</NameTitle>
          {countries.map((item, index, array) => (
            <TextValue key={item.name}>
              {item.name}
              {index === array.length - 1 ? (
                <></>
              ) : (
                <ValueTextSpan>,&nbsp;</ValueTextSpan>
              )}
            </TextValue>
          ))}
        </Flex>

        <Flex>
          <MarginTopTitle>Жанр:&nbsp;</MarginTopTitle>
          {genres.map((item, index, array) => (
            <MarginTopValue key={item.name}>
              {item.name}
              {index === array.length - 1 ? (
                <></>
              ) : (
                <ValueTextSpan>,&nbsp;</ValueTextSpan>
              )}
            </MarginTopValue>
          ))}
        </Flex>

        <Flex>
          <MarginTopTitle>Рейтинг Кинопоиска:&nbsp;</MarginTopTitle>
          <MarginTopValue>{ratingKp}</MarginTopValue>
        </Flex>

        {resolution.width < 1150 && resolution.width > 850 ? (
          <>
            <TitleDescription>Описание:</TitleDescription>
            <Description>{filmInfoId?.description}</Description>
          </>
        ) : null}
      </MetaDesktopOnly>

      {/* Телефон: рейтинг бейджем, год и длительность строкой, жанры чипами */}
      <MetaMobileOnly>
        <MobileMetaRow>
          {ratingKp ? (
            <MobileRating $tier={ratingTier}>{ratingKp}</MobileRating>
          ) : null}
          {metaTexts.map((text, index) => (
            <React.Fragment key={text}>
              {index > 0 ? <MobileMetaDot>·</MobileMetaDot> : null}
              <span>{text}</span>
            </React.Fragment>
          ))}
        </MobileMetaRow>

        {genres?.length ? (
          <MobileGenres>
            {genres.map((genre: any) => (
              <MobileGenre key={genre.name}>{genre.name}</MobileGenre>
            ))}
          </MobileGenres>
        ) : null}
      </MetaMobileOnly>
    </div>
  );
};

export default FilmInfoText;
