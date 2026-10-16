import { SequelsAndPrequelsType } from '@/types/film';
import { FilmsType } from '../../types/FilmsType';

/** Прогресс просмотра: приходит только в ряду «Продолжить просмотр» */
export interface CardProgress {
    percent?: number | null;
    season?: number;
    episode?: number;
    seconds?: number;
    duration?: number | null;
    source?: string;
}

export interface CardProps {
    card: (FilmsType | SequelsAndPrequelsType) & { progress?: CardProgress }
    /** Скрыть закладку сохранения. Нужно в ряду «Продолжить просмотр»:
        там у карточки уже есть крестик «убрать», две кнопки мешают. */
    hideSave?: boolean;
}

