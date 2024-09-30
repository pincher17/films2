import React from 'react';
import { Img, ImgWrap, ImgWrapper, NameFilm, Wrapper } from '../../app/styles/Card.styles';
import Link from 'next/link';
import { ImageCollection, NameCollection } from '@/app/styles/CardCollection.styles';
import { CardStudiosProps } from './CardStudios.types';
import NetflixLogo from '../../../public/assets/img/studios-logo/Netflix_Logo.png';
import AppleTvLogo from '../../../public/assets/img/studios-logo/Apple-Tv-Logo.png';
import Hbo from '../../../public/assets/img/studios-logo/HBO.png';
import Amazon from '../../../public/assets/img/studios-logo/Amazon_Prime.png';
import Hulu from '../../../public/assets/img/studios-logo/Hulu.png';
import Kion from '../../../public/assets/img/studios-logo/Kion.png';
import Premier from '../../../public/assets/img/studios-logo/Premier.png';
import Disney from '../../../public/assets/img/studios-logo/Disney.png';
import DcUniverse from '../../../public/assets/img/studios-logo/DcUniverse.png';
import Okko from '../../../public/assets/img/studios-logo/Okko.png';
import Paramount from '../../../public/assets/img/studios-logo/Paramount.png';
import Max from '../../../public/assets/img/studios-logo/Max.png';
import Peacock from '../../../public/assets/img/studios-logo/Peacock.png';
import Roku from '../../../public/assets/img/studios-logo/Roku.png';
import { StaticImageData } from 'next/image';
import { Image } from './CardStudios.styles';

const logoMap: { [key: string]: StaticImageData } = {
  'Netflix': NetflixLogo,
  'Apple%20TV%2B': AppleTvLogo,
  'HBO': Hbo,
  'Amazon Prime Video': Amazon,
  'Hulu': Hulu,
  'KION': Kion,
  'Premier': Premier,
  'Disney%2B': Disney,
  'DC Universe': DcUniverse,
  'Okko': Okko,
  'Paramount%2B': Paramount,
  'Max': Max,
  'Peacock': Peacock,
  'Roku Channel': Roku,
};

const CardStudios: React.FC<CardStudiosProps> = (props) =>{
    
const {
    id,
    label,
    value,
    slug,
    imgSrc,
  } = props.cards

  const logo = imgSrc || logoMap[value]?.src || '';

    return (
    <Wrapper key={id}>
            <Link href={`studio/${slug}`}>
            <ImgWrapper>
            <ImgWrap>
            <Image
             src={logo} 
             alt={value} 
             />
            </ImgWrap>
            <NameCollection title={label}>{label}</NameCollection>
            </ImgWrapper>
            </Link>
    </Wrapper>
    )
}

export default CardStudios;