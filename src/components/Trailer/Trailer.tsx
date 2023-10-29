import * as React from 'react';
import { Iframe } from '../../app/styles/FilmPage.styles';
import { TrailerProps } from './Trailer.types';
import { ButtonTrailer, CloseIconTrailer, IframeTrailer, Overlay, WrapperButtonTrailer } from '../../app/styles/Trailer.styles';
import { Line1, Line2 } from '@/app/styles/AllFilmsPage.styles';


const Trailer: React.FC<TrailerProps> = ({src}) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
        <WrapperButtonTrailer>
        <ButtonTrailer onClick={handleClickOpen}>Трейлер</ButtonTrailer>
      </WrapperButtonTrailer>
     {open ? <Overlay onClick={handleClose}>
     <CloseIconTrailer sidebar={(+true)} onClick={handleClose}>
          <Line1 />
          <Line2 />
        </CloseIconTrailer>
     {src && <IframeTrailer
                src={src}
                frameBorder="0"
                scrolling="no"
                allowFullScreen
                referrerPolicy="origin"
             ></IframeTrailer>}
     </Overlay> : ''}
    </div>
  );
}

export default Trailer;