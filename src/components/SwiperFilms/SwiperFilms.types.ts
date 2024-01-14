import { CollectionType } from '@/types/CollectionType';
import { FilmsType } from '../../types/FilmsType';
import { SequelsAndPrequelsType } from '@/types/film';

export interface SwiperFilmsProps {
    cards?: Array<FilmsType> | Array<SequelsAndPrequelsType>
    title?: string
    collections?: Array<CollectionType>
}

