
export interface CollectionType {
  category: string;
  name: string;
  slug: string;
  moviesCount: number;
  cover: {
    url: string;
    previewUrl: string;
  };
  createdAt: string;
  updatedAt: string;
  id: string;
}