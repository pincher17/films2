import styled from 'styled-components'
import { FiltersWrapperProps } from '../../components/Filters/Filters.types'

export const Wrapper = styled.div<FiltersWrapperProps>`
 margin-bottom: 50px;

 /* Внутри шторки панель — колонка: середина прокручивается, кнопки внизу
    отдельным блоком. Жест и прокрутку разбирает SwipeableDrawer. */
 @media (max-width: 850px) {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
  width: 100%;
  margin-bottom: 0;
  box-sizing: border-box;
 }
`
export const WrapperInput = styled.div`
  /* было 55px — под колонками фильтров оставалась пустота перед кнопками */
  padding-bottom: 28px;
  @media (max-width: 850px){
    margin-top: -20px;
    padding-bottom: 40px;
    /* Такая же ширина, как у полей рейтинга и года: раньше здесь стоял
       минус 28px, из-за чего списки были уже полей и правый край не совпадал. */
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;

    /* Списки на react-select: обычное правило select к ним не применяется,
       поэтому стилизуем через класс-префикс fh-select (задан в компонентах). */
    .fh-select__control {
      min-height: 52px;
      height: 52px;
      border-radius: 10px;
      font-size: 16px;
      background: #0e0e0e;
      border-color: #343434;
    }

    .fh-select__value-container {
      padding-left: 14px;
    }

    .fh-select__menu {
      font-size: 16px;
      background: #0e0e0e;
    }

    .fh-select__option {
      padding-top: 12px;
      padding-bottom: 12px;
    }
  }
`

export const WrapperAllInputs = styled.div`
    width: 100%;
    margin-bottom: -70px;
    display: grid;
    /* сетка использует освободившееся место: слева слайдеры, справа списки */
    grid-template-columns: minmax(240px, 1fr) minmax(240px, 1fr) minmax(260px, 1fr);
    gap: 22px 34px;
    align-items: start;
  @media (max-width: 1150px){
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 43px;
  }
  @media (max-width: 850px){
    flex: 1 1 auto;
    min-height: 0;
    width: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    margin-bottom: 0;
    /* без отступа: чекбоксы у самого верха */
    padding-top: 0;
    /* запас снизу: последний фильтр не должен прятаться под кнопками */
    padding-bottom: 120px;
    box-sizing: border-box;
  }
`

export const WrapperCheckbox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  /*
   * Сдвигаем визуально, а не отступом: контейнер выравнивает колонки по
   * базовой линии, и margin-top потянул бы вниз «Рейтинг», «Год», «Жанры».
   */
  position: relative;
  top: 30px;
  /* Сдвиг вниз на 30px нужен был на компьютере для выравнивания колонок.
     На телефоне он давал пустоту над чекбоксами — убираем. */
  @media (max-width: 850px) {
    top: 0;
  }
`

export const ButtonWrapper = styled.div`
 width: 220px;

 @media (max-width: 850px) {
  /* Футер лежит ПОВЕРХ списка: только так размытие имеет смысл — оно размывает
     то, что под кнопками. Раньше он стоял в колонке отдельным блоком, под ним
     ничего не было, и blur было просто не видно. */
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 6;
  width: 100%;
  box-sizing: border-box;
  /* боковые отступы как у содержимого: absolute-блок растянут от края до края,
     и без них кнопки прижимались к границам шторки */
  padding: 20px 20px 18px;
  margin: 0;

  /* Мягкая подложка вместо сплошной полосы: размытие и градиент, как в iOS.
     Список под кнопками виден, но кнопки остаются читаемыми. */
  /* Прозрачный градиент обязателен: с непрозрачным концом размытие не видно,
     потому что behind-фильтру нечего показывать. */
  background: linear-gradient(180deg, rgba(21, 21, 21, 0) 0%, rgba(21, 21, 21, 0.55) 45%, rgba(21, 21, 21, 0.86) 100%);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
 }
`
/**
 * Кнопки действий под фильтрами: одинаковая высота у обеих (align-items
 * stretch) и воздух по бокам у основной — иначе текст упирается в края.
 */
export const FiltersActions = styled.div`
  display: flex;
  align-items: stretch;
  gap: 12px;

  & > *:first-child {
    display: flex;
    align-items: center;
    padding-left: 22px;
    padding-right: 22px;
    font-size: 16px;
  }

  /* На телефоне кнопки делят ширину поровну и умеют сжиматься: без этого
     их суммарная ширина распирала шторку и появлялась горизонтальная прокрутка.
     min-width: 0 разрешает сжатие ниже размера текста. */
  @media (max-width: 850px) {
    width: 100%;
    box-sizing: border-box;

    /* Главная кнопка забирает всё свободное место, второстепенная — по тексту:
       так визуально понятно, какое действие основное. */
    & > * {
      min-width: 0;
    }

    & > *:first-child {
      flex: 1 1 auto;
      padding-left: 12px;
      padding-right: 12px;
      font-size: 15px;
    }

    & > *:last-child {
      flex: 0 0 auto;
      padding-left: 18px;
      padding-right: 18px;
      font-size: 15px;
      opacity: 0.9;
    }
  }
`

/**
 * Строка выбора типа: не красная заливка, а плитка с квадратом-галочкой.
 * Активная — ярче рамка и галочка, неактивная — приглушённая.
 */
export const FilterPill = styled.label<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 44px;
  box-sizing: border-box;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  /* те же цвета, что у селектов «Жанры» и «Страны»: фон #0e0e0e, рамка #343434 */
  /* фон и рамка одинаковые в обоих состояниях — как у селектов «Жанры» и «Страны».
     Активность показывают квадрат-галочка и цвет текста, а не рамка. */
  background: #0e0e0e;
  border: 1px solid #343434;
  color: ${(props) => (props.$active ? "#fff" : "rgba(248,248,248,0.6)")};

  input {
    display: none;
  }

  &:hover {
    border-color: #4a4a4a;
  }

  svg {
    display: block;
    flex-shrink: 0;
  }
`

/** Квадрат слева: показывает, что элемент можно нажать */
export const PillBox = styled.span<{ $active?: boolean }>`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, border-color 0.2s ease;

  background: ${(props) => (props.$active ? "#d41515" : "transparent")};
  border: 1.5px solid ${(props) => (props.$active ? "#d41515" : "rgba(255,255,255,0.28)")};
  color: #fff;

  /* галочка всегда на месте, меняется только прозрачность */
  svg {
    opacity: ${(props) => (props.$active ? 1 : 0)};
    transition: opacity 0.15s ease;
  }
`

/** Чипы изменённых фильтров над содержимым панели */
export const ActiveChips = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  /* длинные наборы фильтров листаются вбок, как ленты в мобильных приложениях */
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  margin: 10px 0 18px;
  padding-bottom: 2px;

  &::-webkit-scrollbar {
    display: none;
  }

  /* Чипы нужны только на телефоне: на компьютере фильтры и так видны
     в боковой панели, и строка только загромождала бы заголовок. */
  @media (min-width: 1151px) {
    display: none;
  }

  /* место под прокрутку у самого края экрана */
  @media (max-width: 850px) {
    margin-left: -16px;
    margin-right: -16px;
    padding-left: 16px;
    padding-right: 16px;
  }
`;

export const ActiveChip = styled.span`
  flex: 0 0 auto;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #fff;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
`;
