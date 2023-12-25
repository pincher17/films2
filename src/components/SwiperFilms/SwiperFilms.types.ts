import { CollectionType } from '@/types/CollectionType';
import { FilmsType } from '../../types/FilmsType';

export interface SwiperFilmsProps {
    cards?: Array<FilmsType>
    title?: string
    collections?: Array<CollectionType>
}

