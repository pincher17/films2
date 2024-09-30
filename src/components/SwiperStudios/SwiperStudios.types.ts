import { CollectionType } from '@/types/CollectionType';
import { FilmsType } from '../../types/FilmsType';
import { SequelsAndPrequelsType } from '@/types/film';
import { CardStudiosType } from '@/types/CardStudiosType';

export interface SwiperStudiosProps{
    cards?: Array<FilmsType> | Array<SequelsAndPrequelsType>
    title?: string
    collections: Array<CardStudiosType>
}

