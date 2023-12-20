export type ArrayFilmsType = Array<FilmsType>;

type namesType = {
  name: string;
  language?: string | null
  type?: null
};

export type FilmsType = {
  externalId: {
    imdb: string;
  };
  logo: {
    url: null | string;
  };
  poster: {
    url: string;
    previewUrl: string;
  };
  rating: {
    kp: number;
    imdb: number;
    filmCritics: number;
    russianFilmCritics: number;
    await: number;
  };
  votes: {
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
  shortDescription: null | string;
};
