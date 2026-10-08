import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
  overflow: hidden;
`

/**
 * Наведение на карточку: постер плавно приближается и чуть светлеет,
 * по краю проявляется тонкая рамка, название становится белым.
 *
 * Важно: трансформируется только картинка ВНУТРИ обрезанного контейнера,
 * поэтому в слайдерах (Swiper) размеры слайда не меняются и ничего не «прыгает».
 */
export const ImgWrapper = styled.div`
  position: relative;

  img {
    transition: transform 0.45s cubic-bezier(0.2, 0.7, 0.3, 1), filter 0.45s ease,
      box-shadow 0.3s ease;
    will-change: transform;
  }

  p {
    transition: color 0.3s ease;
  }

  &:hover img {
    transform: scale(1.06);
    filter: brightness(1.08);
    box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.2);
  }

  &:hover p {
    color: #fff;
  }

  /* на тач-устройствах «залипание» ховера не нужно */
  @media (hover: none) {
    &:hover img {
      transform: none;
      filter: none;
      box-shadow: none;
    }
    &:hover p {
      color: inherit;
    }
  }
`

export const Img = styled.img`
  position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  border-radius: 15px;
  background-color: #424242;
`

/**
 * Цвет бейджа зависит от рейтинга: 4 ступени + нейтральный.
 * Смысл — понять уровень оценки, не читая цифру.
 */
export const Rating = styled.div<{ $tier?: string }>`
  width: 44px;
  height: 29px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  position: absolute;
  top: 5px;
  left: 5px;
  background-color: ${(props) => {
    switch (props.$tier) {
      case "top":
        return "#219653"; // 8.0 и выше — зелёный
      case "good":
        return "#6f9c1b"; // 7.0–7.9 — салатовый
      case "mid":
        return "#d98324"; // 6.0–6.9 — оранжевый
      case "weak":
        return "#6b6b6b"; // 5.0–5.9 — серый
      case "low":
        return "#c0392b"; // ниже 5.0 — красный
      default:
        return "rgba(30, 30, 30, 0.85)"; // рейтинга нет — нейтральный
    }
  }};
`
export const RatingNum = styled.span`
  color: white;
  font-weight: 500;
`
export const Year = styled.div`
  /* margin-bottom: 55px;
  margin-top: -5px; */
  color: #f8f8f8a6;;
`
export const ImgWrap = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 15px;
  &::after {
    display: block;
    content: '';
    /* 16:9 aspect ratio */
    padding-bottom: 150%;
  }
  
`
export const NameFilm = styled.p`
  white-space: nowrap; /* Запрещаем перенос строк */
    overflow: hidden; /* Обрезаем все, что не помещается в область */
    text-overflow: ellipsis; /* Добавляем многоточие */
    margin-top: 13px;
    margin-bottom: 6px;
`

/**
 * Полоска прогресса просмотра. Показывается только там, где он известен —
 * то есть в ряду «Продолжить просмотр»; в каталоге и подборках её нет.
 */
export const ProgressTrack = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 5px;
  background: rgba(0, 0, 0, 0.55);
  overflow: hidden;
  z-index: 2;
`

export const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(props) => Math.max(3, Math.min(100, props.$percent))}%;
  background: #d41515;
`

/** «Сезон 2 · Серия 7» — только для сериалов, где серия известна */
export const EpisodeLabel = styled.div`
  color: rgba(248, 248, 248, 0.55);
  font-size: 13px;
  margin-bottom: 4px;
`

/**
 * Значок паузы на постере: показывает, что просмотр остановлен здесь.
 * Ставится над полоской прогресса, чтобы не мешать ей.
 */
export const ResumeBadge = styled.span`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  /*
   * Треугольник нужно сдвинуть на 1px вправо: у него плоское основание слева
   * и остриё справа, поэтому строго геометрический центр читается как смещение
   * влево. Больше 1-2px уже выглядит как сдвиг вправо.
   */
  padding-left: 1px;

  /* inline-SVG садится на базовую линию текста и «уезжает» вниз-вверх —
     блочный режим убирает этот зазор */
  svg {
    display: block;
  }
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(12, 12, 12, 0.74);
  color: #fff;
  backdrop-filter: blur(2px);
`

/**
 * Накладка внизу постера: значок паузы и подпись с серией и остатком.
 * Тёмный градиент снизу — чтобы текст читался на любом artwork.
 * Полоска прогресса остаётся ниже, по самому краю.
 */
export const PosterOverlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 22px 10px 8px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.88), rgba(0, 0, 0, 0));
  pointer-events: none;
`

export const OverlayText = styled.span`
  min-width: 0;
  color: #fff;
  font-size: 12.5px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
