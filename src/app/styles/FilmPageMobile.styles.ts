import styled from "styled-components";
import { Img, ImgWrap, ImgWrapper } from "./Card.styles";


export const Wrapper = styled.div`
  z-index: 1;
  padding-right: 20px;
  padding-left: 20px;
  /*
   * Нижняя навигация закреплена и перекрывала содержимое: плашка и начало
   * описания уходили под неё. Оставляем место под панель.
   */
  padding-bottom: 96px;
`;

export const Gradient = styled.div`
  /*
   * Фон — отдельный absolute-слой. Без отрицательного z-index он рисуется
   * ПОВЕРХ обычных (непозиционированных) блоков и накрывал кнопки, плашку
   * и текст. Так как слой чисто декоративный, уводим его под содержимое.
   */
  z-index: -1;
  width: 100%;
    margin-top: -80px;
    position: absolute;
    left: 0;
    background: rgb(0,0,0);
    background: linear-gradient(0deg, rgb(0 0 0 / 85%) 25%, rgb(0 0 0 / 0%) 100%);
    height: 750px;
    &::after{
    content: "";
    display: block;
    position: absolute;
    z-index: 2;
    left: 0;
    top: 100px;
    height: 100%;
    bottom: -1px;
    right: 0;
    background: linear-gradient(180deg,transparent 50%,transparent 52.63%,rgba(0,0,0,.03) 55.25%,rgba(0,0,0,.08) 57.88%,rgba(0,0,0,.14) 60.51%,rgba(0,0,0,.23) 63.13%,rgba(0,0,0,.33) 65.76%,rgba(0,0,0,.44) 68.39%,rgba(0,0,0,.55) 71.01%,rgba(0,0,0,.66) 73.64%,rgba(0,0,0,.77) 76.27%,rgba(0,0,0,.85) 78.89%,rgba(0,0,0,.92) 81.52%,rgba(0,0,0,.96) 84.15%,rgba(0,0,0,.99) 86.77%,#000 89.4%);
  }
`;

export const BackgroundImage = styled.img`
    width: 100%;
    position: absolute;
    filter: blur(40px);
    z-index: -2;
    height: 500px;
`;

export const WrapperInfo = styled.div`
    @media (max-width: 1150px){
    display: flex;
    /* flex-direction: row-reverse; */
    justify-content: space-between;
    justify-content: center;
  }
`;
export const WrapperWatchFilm = styled.div`
  display: flex;
  position: relative;
  @media (max-width: 1150px){
    display: initial;
    position: initial;
    /* margin-right: 30px; */
    & > div{
        margin-bottom: 40px;
        text-align: center;
    }
  }
  @media (max-width: 850px){
    & > div{
        margin-bottom: 20px;
        text-align: center;
        /* padding-left: 25px; */
        position: relative;
        z-index: 3;
    }
  }
`;
export const Name = styled.div`
  font-size: 36px;
  font-weight: bolder;
`;
export const Flex = styled.div`
  display: flex;
`;
export const NameTitle = styled.p`
  color: rgba(255, 255, 255, 0.514);
  font-size: 20px;
`;
export const TextValue = styled.p`
  font-size: 20px;
`;
export const ValueTextSpan = styled.span`
  font-size: 20px;
`;
export const MarginTopTitle = styled(NameTitle)`
  margin-top: -8px;
`;
export const MarginTopValue = styled(TextValue)`
  margin-top: -8px;
`;
export const ImgWrapperFilmMobile = styled(ImgWrapper)`
  /* было 280px — постер выглядел мелким на фоне пустых полей */
  width: 320px;
  max-width: 100%;
  margin: 0 auto;
`;
export const ImgWrapFilmMobile = styled(ImgWrap)`
  /* та же пропорция 2:3, что у постера: 320 × 474 */
  height: 474px;
  border-radius: 16px;
  overflow: hidden;
`;
export const ImgMainMobile = styled(Img)`
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7);
`;

export const PositionAbsolute = styled.div`
  position: absolute;
`;
export const Film = styled.div`
  position: absolute !important;
  width: 70% !important;
  height: 100% !important;
`;
export const iframe = styled.div`
  position: absolute !important;
  width: 100% !important;
  height: 100% !important;
`;
export const TitleDescription = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-top: 20px;
`;
export const Description = styled.p`
  margin-top: 15px;
  font-size: 18px;
  margin-bottom: 80px;
  width: 100%;
  @media (max-width: 850px){
    margin-bottom: 40px;
  }
`;

export const WrapperDescription = styled.p`
  @media (max-width: 850px){
    padding-left: 25px;
  }
`;

export const SwiperWrapperSimilar = styled.div`
  /*
   * Слайдер добавляет собственное пустое место сверху, из-за которого
   * заголовок секции оказывался далеко от карточек. На телефоне убираем.
   */
  @media (max-width: 850px) {
    margin-top: -24px;
  }
`;


export const ButtonWatch = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* во всю ширину — той же, что у плашки и остальных блоков */
  width: 100%;
  height: 58px;
  margin-top: 22px;
  border-radius: 12px;
  background-color: #d41515;
  color: #fff;
  font-weight: 600;
  font-size: 17px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:active {
    background-color: #b31212;
  }
`;

export const TrailerButtonWatch = styled(ButtonWatch)`
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.28);
  font-weight: 500;

  &:active {
    background: rgba(255, 255, 255, 0.08);
  }
`;

export const Bottom = styled.div`
margin-top: 85px;
`;
/* ===== Мобильный дизайн: заголовки, описание, детали ===== */

/** Заголовок раздела: один размер и один отступ по всей странице */
export const MobileSectionTitle = styled.h2`
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.01em;
  /*
   * Отступ сверху больше, снизу меньше: заголовок должен относиться к своему
   * блоку, а не висеть между предыдущим текстом и карточками.
   */
  margin: 36px 0 6px;
  color: #fff;
`;

/** Описание: приглушённый цвет, читаемый межстрочный интервал, обрезка */
export const MobileDescription = styled.p<{ $open?: boolean }>`
  font-size: 15px;
  line-height: 1.65;
  color: rgba(248, 248, 248, 0.72);

  ${(props) =>
    props.$open
      ? ""
      : `display: -webkit-box;
         -webkit-line-clamp: 5;
         -webkit-box-orient: vertical;
         overflow: hidden;`}
`;

/** Кнопка «Читать полностью» под описанием */
export const MobileMore = styled.button<{ $open?: boolean }>`
  margin-top: 10px;
  padding: 0;
  border: 0;
  background: none;
  /*
   * Не красный (красный — цвет главного действия) и не серый как текст:
   * белым со стрелкой-шевроном — так это читается как действие, а не как
   * продолжение описания. Приём Кинопоиска и Apple TV.
   */
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  svg {
    display: block;
    transition: transform 0.2s ease;
    transform: rotate(${(props) => (props.$open ? 180 : 0)}deg);
  }

  &:active {
    opacity: 0.75;
  }
`;

/** Детали: подпись слева, значение справа — вместо сплошных строк */
export const MobileDetailsRow = styled.div`
  display: flex;
  gap: 14px;
  padding: 11px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  font-size: 15px;
  line-height: 1.45;

  &:last-of-type {
    border-bottom: 0;
  }
`;

export const MobileDetailsLabel = styled.span`
  flex: 0 0 108px;
  color: rgba(248, 248, 248, 0.45);
`;

export const MobileDetailsValue = styled.span`
  flex: 1;
  color: #fff;
`;

/** SEO-строка: мелкая и приглушённая, чтобы не спорила с содержанием */
export const MobileSeo = styled.p`
  margin-top: 26px;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(248, 248, 248, 0.38);
`;

/** Компактный мета-блок на телефоне: бейдж рейтинга и строки через точку */
export const MobileMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  font-size: 15px;
  color: rgba(248, 248, 248, 0.6);
`;

/** Рейтинг — цветным бейджем, как на карточках: сразу видно, хороший он или нет */
export const MobileRating = styled.span<{ $tier: string }>`
  padding: 4px 9px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  color: #fff;
  background: ${(props) =>
    props.$tier === "top"
      ? "#219653"
      : props.$tier === "good"
      ? "#6f9c1b"
      : props.$tier === "mid"
      ? "#d98324"
      : props.$tier === "weak"
      ? "#6b6b6b"
      : props.$tier === "low"
      ? "#c0392b"
      : "rgba(30, 30, 30, 0.85)"};
`;

export const MobileMetaDot = styled.span`
  color: rgba(248, 248, 248, 0.3);
`;

/** Жанры — чипами, вместо строки «Жанр: триллер, криминал, комедия» */
export const MobileGenres = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

export const MobileGenre = styled.span`
  padding: 5px 11px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 13.5px;
  color: rgba(248, 248, 248, 0.78);
`;

/*
 * Переключение мета-блока по ширине экрана средствами CSS, а не по JS:
 * ширина измеряется в useEffect и на первом рендере равна нулю, из-за чего
 * компактный вариант не включался.
 */
export const MetaDesktopOnly = styled.div`
  @media (max-width: 850px) {
    display: none;
  }
`;

export const MetaMobileOnly = styled.div`
  display: none;

  @media (max-width: 850px) {
    display: block;
  }
`;

/** Год в заголовке: на телефоне он уже есть в строке метаданных */
export const TitleYear = styled.span`
  @media (max-width: 850px) {
    display: none;
  }
`;

/**
 * Закладка в углу постера на мобильной странице фильма.
 * Отдельная кнопка «Сохранить» в столбике действий была лишней: три равные
 * кнопки спорили друг с другом. Здесь то же место, что на карточках каталога,
 * поэтому привычно и не мешает главному действию.
 */
export const PosterSaveButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 5;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 10px;
  background: rgba(12, 12, 12, 0.72);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  cursor: pointer;
  transition: background 0.18s ease, transform 0.12s ease;

  &:active {
    transform: scale(0.94);
  }
`;

/**
 * Ряд действий: квадратная кнопка сохранения слева, «Смотреть» — справа.
 * Главное действие остаётся широким и заметным, а сохранение — компактным.
 */
export const WatchRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 12px;
  margin-top: 22px;

  & > *:last-child {
    flex: 1 1 auto;
    width: auto;
    margin-top: 0;
  }
`;

/** Квадратная кнопка сохранения: та же высота, что у кнопки просмотра. */
export const SaveSquareButton = styled.button`
  flex: 0 0 auto;
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.12s ease;

  /* Иконка задана размером под карточку (15x17) — внутри крупной кнопки она
     выглядела мелкой, поэтому задаём размер здесь. У рисунка свои пропорции
     (18 из 24 по высоте), отсюда запас: получается примерно 20x24. */
  & svg {
    width: 26px;
    height: 30px;
  }

  &:active {
    transform: scale(0.97);
  }
`;
