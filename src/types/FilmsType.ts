export type ArrayFilmsType = Array<FilmsType>;

type namesType = {
  _id: string;
  name: string;
};

export type FilmsType = {
  externalId: {
    _id: string;
    imdb: string;
  };
  logo: {
    _id: string;
    url: null | string;
  };
  poster: {
    _id: string;
    url: string;
    previewUrl: string;
  };
  rating: {
    _id: string;
    kp: number;
    imdb: number;
    filmCritics: number;
    russianFilmCritics: number;
    await: number;
  };
  votes: {
    _id: string;
    kp: number;
    imdb: number;
    filmCritics: number;
    russianFilmCritics: number;
    await: number;
  };
  movieLength: number;
  id: number;
  type: string;
  name: string;
  description: string;
  year: number;
  alternativeName: string;
  enName: null | string;
  names: Array<namesType>;
  shortDescription: null;
};
