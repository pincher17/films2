import type { Metadata } from "next";
import CatalogPage from "@/components/CatalogPage/CatalogPage";

export const metadata: Metadata = {
  title: "Все фильмы смотреть онлайн на Filmhub",
  description: "Все фильмы — смотрите онлайн в хорошем качестве на Filmhub",
};

export default function Page() {
  return <CatalogPage section="movies" />;
}
