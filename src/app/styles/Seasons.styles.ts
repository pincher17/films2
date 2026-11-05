import styled from 'styled-components'

/**
 * Блок «Сезоны» на странице сериала: дата выхода каждого сезона.
 *
 * Длинные сериалы (у «Симпсонов» 38 сезонов) сеткой растягивали страницу на
 * восемь рядов, поэтому сезоны лежат в горизонтальной ленте — как «Похожие» и
 * «Актёры» на этой же странице. Стрелки появляются только тогда, когда листать
 * действительно есть куда, и прячутся на телефоне: там лента листается пальцем.
 */
export const SeasonsRow = styled.div`
  position: relative;
  margin-top: 18px;

  @media (max-width: 850px) {
    margin-top: 14px;
  }
`

export const SeasonsTrack = styled.div`
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scroll-behavior: smooth;
  /* прокрутка с мягкой фиксацией карточек по краю */
  scroll-snap-type: x proximity;
  padding: 2px;
  /* полосу прокрутки не показываем: листают стрелками или пальцем */
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 850px) {
    gap: 10px;
  }
`

export const SeasonCard = styled.div`
  flex: 0 0 240px;
  scroll-snap-align: start;
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
    flex: 0 0 200px;
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
  /* «Сезон 16» не должен переноситься: иначе карточки в ленте разной высоты */
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

/**
 * Стрелка ленты. Кружок той же геометрии и тех же цветов, что у стрелок
 * «Похожих»: серый в покое, красный при наведении.
 */
export const SeasonsArrow = styled.button<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  /* тот же отступ, что у стрелок «Похожих»: они стоят в поле страницы,
     а не поверх карточек */
  ${({ $side }) => ($side === 'left' ? 'left: -50px;' : 'right: -50px;')}
  z-index: 3;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background-color: #747474;
  background-image: ${({ $side }) =>
    $side === 'left' ? "url('/arrowPrev.svg')" : "url('/arrowNext.svg')"};
  background-repeat: no-repeat;
  background-size: 50% auto;
  background-position: center;
  box-shadow: 0 4px 11px rgba(0, 0, 0, 0.2);
  transition: background-color 0.18s ease;

  &:hover {
    background-color: #b81716;
    background-image: ${({ $side }) =>
      $side === 'left' ? "url('/arrowPrevHover.svg')" : "url('/arrowNextHover.svg')"};
  }

  /* на телефоне лента листается пальцем, стрелки только мешают */
  @media (max-width: 850px) {
    display: none;
  }
`
