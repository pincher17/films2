import { FilmsType } from '../../types/FilmsType';

export interface CardsProps {
  /* Показывать заглушки вместо карточек: нужно страницам со своим
     состоянием загрузки, например «Сохранённому» */
  loading?: boolean;
  /** Обработчик удаления: добавляет крестик вместо закладки */
  onRemove?: (card: any) => void;
    cards: any
}

