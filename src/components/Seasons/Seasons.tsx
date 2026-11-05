import React from 'react';
import {
  SeasonBody,
  SeasonCard,
  SeasonDate,
  SeasonEpisodes,
  SeasonName,
  SeasonPoster,
  SeasonScore,
  SeasonsArrow,
  SeasonsRow,
  SeasonsTrack,
  SeasonTop,
} from '../../app/styles/Seasons.styles';

/**
 * Сезоны сериала с датами выхода.
 *
 * Сам блок ничего не запрашивает: данные уже пришли с сервера вместе со
 * страницей (TMDB отдаёт seasons в ответе /tv/{id}). Если дата не объявлена —
 * так и пишем, вместо пустого места.
 *
 * Длинные сериалы листаются вбок. Стрелки показываем по фактическому
 * положению прокрутки, а не «всегда»: у сериала с двумя сезонами листать
 * нечего, и лишние кнопки только путают.
 */
type Season = {
  number: number;
  name?: string;
  airDate?: string | null;
  episodes?: number;
  rating?: number | null;
  poster?: string | null;
};

type SeasonsProps = {
  seasons?: Season[] | null;
};

const MONTHS = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

/** «2008-01-20» → «20 января 2008» */
function formatAirDate(value?: string | null) {
  if (!value) return null;
  const [year, month, day] = String(value).split('-').map(Number);
  if (!year || !month || !day || month < 1 || month > 12) return null;
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/** 1 серия / 2 серии / 5 серий */
function episodesLabel(count: number) {
  const tail = count % 100;
  const last = count % 10;
  if (tail > 10 && tail < 20) return 'серий';
  if (last === 1) return 'серия';
  if (last >= 2 && last <= 4) return 'серии';
  return 'серий';
}

const Seasons: React.FC<SeasonsProps> = ({ seasons }) => {
  const list = (seasons || []).filter((season) => season && Number(season.number) > 0);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [edges, setEdges] = React.useState({ left: false, right: false });

  const updateEdges = React.useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setEdges({
      left: track.scrollLeft > 4,
      right: track.scrollLeft + track.clientWidth < track.scrollWidth - 4,
    });
  }, []);

  React.useEffect(() => {
    updateEdges();
    const track = trackRef.current;
    if (!track) return undefined;

    track.addEventListener('scroll', updateEdges, { passive: true });
    /* ширина меняется при повороте экрана и на ресайзе окна — пересчитываем */
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);

    return () => {
      track.removeEventListener('scroll', updateEdges);
      observer.disconnect();
    };
  }, [updateEdges, list.length]);

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    /* сдвигаем чуть меньше экрана: так на краю остаётся часть следующей
       карточки и видно, что лента продолжается */
    track.scrollBy({ left: direction * Math.round(track.clientWidth * 0.8), behavior: 'smooth' });
  };

  if (!list.length) return null;

  return (
    <SeasonsRow>
      <SeasonsTrack ref={trackRef}>
        {list.map((season) => {
          const date = formatAirDate(season.airDate);
          const episodes = Number(season.episodes) || 0;
          return (
            <SeasonCard key={season.number}>
              {season.poster ? (
                <SeasonPoster src={season.poster} alt={`Сезон ${season.number}`} loading="lazy" />
              ) : null}
              <SeasonBody>
                <SeasonTop>
                  <SeasonName>Сезон {season.number}</SeasonName>
                  {season.rating ? <SeasonScore>{season.rating.toFixed(1)}</SeasonScore> : null}
                </SeasonTop>
                <SeasonDate>{date || 'Дата не объявлена'}</SeasonDate>
                {episodes ? (
                  <SeasonEpisodes>
                    {episodes} {episodesLabel(episodes)}
                  </SeasonEpisodes>
                ) : null}
              </SeasonBody>
            </SeasonCard>
          );
        })}
      </SeasonsTrack>

      {edges.left ? (
        <SeasonsArrow $side="left" type="button" aria-label="Предыдущие сезоны" onClick={() => scrollByPage(-1)} />
      ) : null}
      {edges.right ? (
        <SeasonsArrow $side="right" type="button" aria-label="Следующие сезоны" onClick={() => scrollByPage(1)} />
      ) : null}
    </SeasonsRow>
  );
};

export default Seasons;
