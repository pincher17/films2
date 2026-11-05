import styled from 'styled-components'

/**
 * Рейтинги фильма по источникам: IMDb, TMDB, Кинопоиск.
 *
 * Источники различаются цветом подписи (у каждого своя марка), значение всегда
 * белое: так строка читается как «чья это оценка», но не превращается в
 * светофор из трёх ярких плашек.
 */
export const RatingsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  /* слоган уже даёт 14px снизу; здесь нужен отступ до строки «год · жанры»,
     иначе плашки липнут к ней и кажется, что весь ряд съехал вниз */
  margin: 0 0 16px;

  /* на телефоне весь мета-блок по центру: плашки тоже */
  @media (max-width: 850px) {
    justify-content: center;
  }
`

const BRAND_BG = {
  imdb: '#f5c518',
  tmdb: '#01b4e4',
  kinopoisk: '#ff5500',
} as const;

const BRAND_TEXT = {
  imdb: '#0d0d0d',
  tmdb: '#ffffff',
  kinopoisk: '#ffffff',
} as const;

export const RatingChip = styled.div<{ $brand?: 'imdb' | 'tmdb' | 'kinopoisk'; $filled?: boolean }>`
  display: inline-flex;
  /* именно center, а не baseline: при разном кегле подписи и цифры
     выравнивание по базовой линии прижимало текст к верхнему краю плашки */
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 13px;
  border-radius: 10px;
  background: ${({ $brand, $filled }) =>
    $filled && $brand ? BRAND_BG[$brand] : 'rgba(255, 255, 255, 0.06)'};
  border: 1px solid
    ${({ $filled }) => ($filled ? 'transparent' : 'rgba(255, 255, 255, 0.08)')};

  @media (max-width: 850px) {
    height: 28px;
    padding: 0 10px;
    gap: 6px;
    border-radius: 8px;
  }
`

/** Название источника: цвет — марка, размер мелкий, чтобы не спорить с цифрой */
export const RatingSource = styled.span<{ $brand: 'imdb' | 'tmdb' | 'kinopoisk'; $filled?: boolean }>`
  font-size: 12.5px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.4px;
  text-transform: uppercase;

  @media (max-width: 850px) {
    font-size: 11px;
  }
  color: ${({ $brand, $filled }) =>
    $filled ? BRAND_TEXT[$brand] : $brand === 'imdb' ? '#f5c518' : $brand === 'tmdb' ? '#01b4e4' : '#ff5500'};
`

export const RatingValue = styled.span<{ $brand?: 'imdb' | 'tmdb' | 'kinopoisk'; $filled?: boolean }>`
  font-size: 18px;
  font-weight: 700;
  color: ${({ $brand, $filled }) => ($filled && $brand ? BRAND_TEXT[$brand] : '#fff')};
  line-height: 1;

  @media (max-width: 850px) {
    font-size: 15px;
  }
`

/** Десятая доля мельче: 8.4 читается как одно число, а не как два */
export const RatingFraction = styled.span`
  font-size: 13px;
  font-weight: 600;
  opacity: 0.75;
`
