import styled from 'styled-components'

/**
 * Блок «Сезоны» на странице сериала: дата выхода каждого сезона.
 *
 * Карточки повторяют язык остальной страницы: тёмная подложка, скругление
 * 15px как у постеров, красный акцент при наведении. Сетка сама раскладывается
 * по ширине экрана, на телефоне — в две колонки.
 */
export const SeasonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
  margin-top: 18px;

  @media (max-width: 850px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 14px;
  }
`

export const SeasonCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(160deg, #191919 0%, #0e0e0e 100%);
  transition: border-color 0.18s ease, transform 0.18s ease;

  &:hover {
    border-color: rgba(211, 41, 41, 0.55);
    transform: translateY(-2px);
  }

  @media (max-width: 850px) {
    padding: 10px 11px;
    border-radius: 12px;
    gap: 9px;
    /* на телефоне подъём при наведении не нужен: там нет наведения */
    &:hover {
      transform: none;
    }
  }
`

/** Постер сезона: узкая обложка слева, как в списках на стримингах */
export const SeasonPoster = styled.img`
  width: 46px;
  height: 68px;
  flex-shrink: 0;
  border-radius: 8px;
  object-fit: cover;
  background: #1c1c1c;

  @media (max-width: 850px) {
    width: 38px;
    height: 56px;
    border-radius: 6px;
  }
`

/** Текстовая часть карточки: название, дата, число серий */
export const SeasonBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`

export const SeasonTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

export const SeasonName = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  line-height: 1.25;
  /* «Сезон 16» не должен переноситься: иначе карточки в ряду разной высоты */
  white-space: nowrap;

  @media (max-width: 850px) {
    font-size: 15px;
  }
`

/** Оценка сезона в TMDB: маленькая плашка, чтобы не спорить с названием */
export const SeasonScore = styled.span`
  flex-shrink: 0;
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.07);
  color: #e8e8e8;
  font-size: 11.5px;
  font-weight: 600;
`

export const SeasonDate = styled.span`
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.66);
  line-height: 1.35;

  @media (max-width: 850px) {
    font-size: 12.5px;
  }
`

export const SeasonEpisodes = styled.span`
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.42);

  @media (max-width: 850px) {
    font-size: 12px;
  }
`
