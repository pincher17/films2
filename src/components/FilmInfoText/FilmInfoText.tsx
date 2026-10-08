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
import { FilmInfoTextProps } from "./FilmInfoText.types";
import roundNumber from "../helpers/rounding";
import {
  MobileGenre,
  MobileGenres,
  MobileMetaDot,
  MobileMetaRow,
  MobileRating,
} from "../../app/styles/FilmPageMobile.styles";

const FilmInfoText: React.FC<FilmInfoTextProps> = (props) => {
  const { filmInfoId, countries, genres, ratingKinopoisk, resolution } = props;

  const ratingKp = roundNumber(ratingKinopoisk, 1)

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

  /*
   * На телефоне метаданные показываем компактно: три серые строки подряд
   * выглядели тяжёлым списком. Рейтинг — бейджем, год и длительность рядом,
   * жанры — чипами. На компьютере ветка не выполняется, там всё как было.
   */
  if (resolution?.width > 0 && resolution.width <= 850) {
    const metaTexts = [
      filmInfoId?.year ? String(filmInfoId.year) : null,
      filmInfoId?.movieLength ? `${filmInfoId.movieLength} мин` : null,
      countries?.length ? countries.map((country: any) => country.name).join(", ") : null,
    ].filter(Boolean) as string[];

    return (
      <div>
        <Name itemProp="name">
          {filmInfoId?.name && (
            <>
              {filmInfoId.name} {filmInfoId.year ? `(${filmInfoId.year}\u00A0г.)` : ""}
            </>
          )}
        </Name>

        <MobileMetaRow>
          {ratingKp ? <MobileRating $tier={ratingTier}>{ratingKp}</MobileRating> : null}
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
      </div>
    );
  }

  return (
    <div>
      <Name itemProp="name">
        {filmInfoId?.name && (
          <>
            {filmInfoId.name} {filmInfoId.year ? `(${filmInfoId.year}\u00A0г.)` : ""}
          </>
        )}
      </Name>

      <Flex>
        <NameTitle>Страна:&nbsp;</NameTitle>
        {countries.map((i, index, arr) => (
          <>
            <TextValue key={i.name}>
              {i.name}
              {index === arr.length - 1 ? (
                <></>
              ) : (
                <ValueTextSpan>,&nbsp;</ValueTextSpan>
              )}
            </TextValue>
          </>
        ))}
      </Flex>

      <Flex>
        <MarginTopTitle>Жанр:&nbsp;</MarginTopTitle>
        {genres.map((i, index, arr) => (
          <>
            <MarginTopValue key={i.name}>
              {i.name}
              {index === arr.length - 1 ? (
                <></>
              ) : (
                <ValueTextSpan>,&nbsp;</ValueTextSpan>
              )}
            </MarginTopValue>
          </>
        ))}
      </Flex>

      <Flex>
        <MarginTopTitle>Рейтинг Кинопоиска:&nbsp;</MarginTopTitle>
        <>
          <MarginTopValue>{ratingKp}</MarginTopValue>
        </>
      </Flex>

      {resolution.width < 1150 && resolution.width > 850 ? (
        <>
          <TitleDescription>Описание:</TitleDescription>
          <Description>{filmInfoId?.description}</Description>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default FilmInfoText;
