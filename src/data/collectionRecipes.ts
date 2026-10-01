/**
 * Рецепты подборок: слаг -> запрос к TMDB.
 * Названия остаются прежними, содержимое собирается заново (Кинопоиск больше не источник).
 * genres — жанры (И), keywords — ключевые слова TMDB (английские).
 */
export type CollectionRecipe = {
  name: string;
  types: string;
  genres?: string[];
  keywords?: string[];
  companyId?: number;
  networkId?: number;
  sortBy?: string;
  voteCountMin?: number;
  yearFrom?: number;
  yearTo?: number;
};

const RATED = { sortBy: "vote_average.desc", voteCountMin: 20000 };

export const COLLECTION_RECIPES: Record<string, CollectionRecipe> = {
  top250: { ...RATED, name: "250 лучших фильмов", types: "1" },
  "popular-films": { name: "Популярные фильмы", types: "1", sortBy: "popularity.desc", voteCountMin: 50 },
  "popular-series": { name: "Популярные сериалы", types: "2", sortBy: "popularity.desc", voteCountMin: 50 },
  "100_greatest_TVseries": { name: "100 великих сериалов XXI века", types: "2", sortBy: "vote_average.desc", voteCountMin: 2000, yearFrom: 2000 },
  "series-top250": { name: "250 лучших сериалов", types: "2", sortBy: "vote_average.desc", voteCountMin: 2000 },
  hbo_best: { name: "Шедевры HBO", types: "1,2", networkId: 49, companyId: 3268, voteCountMin: 50 },
  marvel_universe: { name: "Киновселенная MARVEL", types: "1,2", companyId: 420, voteCountMin: 100 },
  "hd-must-see": { name: "Фильмы, которые стоит посмотреть", types: "1", sortBy: "vote_average.desc", voteCountMin: 10000 },
  "hd-adaptation": { name: "Лучшие экранизации", types: "1", keywords: ["based on novel"], voteCountMin: 500 },
  "hd-real-story": { name: "Фильмы по реальным событиям", types: "1", keywords: ["based on true story"], voteCountMin: 300 },
  ozvucheno_kubik_v_kube: { name: "Озвучено студией «Кубик в кубе»", types: "1", keywords: ["dubbed"], voteCountMin: 50 },
  theme_ww2: { name: "Фильмы 1941–1945", types: "1", genres: ["военный"], yearTo: 1945, voteCountMin: 50 },
  theme_worlds_end: { name: "Фильмы про апокалипсис", types: "1", keywords: ["apocalypse"], voteCountMin: 200 },
  theme_comics: { name: "Фильмы, основанные на комиксах", types: "1", keywords: ["based on comic"], voteCountMin: 300 },
  theme_romantic_comedy: { name: "Романтические комедии", types: "1", genres: ["мелодрама", "комедия"], voteCountMin: 500 },
  about_programmers: { name: "Фильмы и сериалы про программистов", types: "1,2", keywords: ["programmer", "computer"], voteCountMin: 50 },
  theme_dance: { name: "Фильмы про танцы", types: "1", keywords: ["dance"], voteCountMin: 100 },
  theme_catastrophe: { name: "Фильмы-катастрофы", types: "1", keywords: ["disaster"], voteCountMin: 200 },
  theme_space: { name: "Фильмы про космос", types: "1", keywords: ["space"], voteCountMin: 300 },
  theme_zombie: { name: "Фильмы про зомби", types: "1", keywords: ["zombie"], voteCountMin: 200 },
  theme_love: { name: "Фильмы про любовь", types: "1", genres: ["мелодрама"], voteCountMin: 500 },
  theme_vampire: { name: "Фильмы про вампиров", types: "1", keywords: ["vampire"], voteCountMin: 200 },
};

export function collectionName(slug: string): string {
  return COLLECTION_RECIPES[slug]?.name || slug;
}
