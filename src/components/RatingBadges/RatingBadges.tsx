import React from 'react';
import {
  RatingChip,
  RatingFraction,
  RatingsRow,
  RatingSource,
  RatingValue,
} from '../../app/styles/RatingBadges.styles';

/**
 * Рейтинги фильма с указанием источника.
 *
 * Показываем только те оценки, которые у нас действительно есть: IMDb — из
 * своей базы (датасет IMDb), TMDB — его собственная оценка, Кинопоиск — когда
 * появится источник. Пустые источники не рисуем, чтобы не было пустых плашек.
 *
 * Порядок: IMDb, Кинопоиск, TMDB — от самой ожидаемой читателем оценки к
 * служебной.
 */
type RatingValueType = { value?: number | null; votes?: number | null } | null;

type RatingsProps = {
  ratings?: {
    imdb?: RatingValueType;
    kinopoisk?: RatingValueType;
    tmdb?: RatingValueType;
  } | null;
};

/* Вид плашек: false — тёмные с цветной подписью, true — залитые цветом бренда.
   Сейчас включён тёмный: яркие плашки спорят с красным акцентом сайта. */
const FILLED = false;

const ORDER = [
  { key: 'imdb', label: 'IMDb', brand: 'imdb' },
  { key: 'kinopoisk', label: 'КП', brand: 'kinopoisk' },
  { key: 'tmdb', label: 'TMDB', brand: 'tmdb' },
] as const;

/** Число оценок для подсказки: в строке оно не нужно, а в title полезно */
const votesLabel = (votes?: number | null) =>
  votes ? `${Math.round(votes).toLocaleString('ru-RU')} оценок` : '';

const RatingBadges: React.FC<RatingsProps> = ({ ratings }) => {
  const items = ORDER.map(({ key, label, brand }) => {
    const rating = ratings?.[key];
    const value = Number(rating?.value);
    if (!value || !Number.isFinite(value)) return null;
    const text = value.toFixed(1);
    const [whole, fraction] = text.split('.');
    return { key, label, brand, whole, fraction, votes: rating?.votes };
  }).filter(Boolean) as Array<{
    key: string;
    label: string;
    brand: 'imdb' | 'tmdb' | 'kinopoisk';
    whole: string;
    fraction?: string;
    votes?: number | null;
  }>;

  if (!items.length) return null;

  return (
    <RatingsRow>
      {items.map((item) => (
        <RatingChip
          key={item.key}
          $brand={item.brand}
          $filled={FILLED}
          title={[`${item.label}: ${item.whole}.${item.fraction || '0'}`, votesLabel(item.votes)]
            .filter(Boolean)
            .join(' · ')}
        >
          <RatingSource $brand={item.brand} $filled={FILLED}>{item.label}</RatingSource>
          <RatingValue $brand={item.brand} $filled={FILLED}>
            {item.whole}
            {item.fraction ? <RatingFraction>.{item.fraction}</RatingFraction> : null}
          </RatingValue>
        </RatingChip>
      ))}
    </RatingsRow>
  );
};

export default RatingBadges;
