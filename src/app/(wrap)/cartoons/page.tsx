import type { Metadata } from "next";
import CatalogPage from "@/components/CatalogPage/CatalogPage";

export const metadata: Metadata = {
  title: "Мультфильмы смотреть онлайн на Filmhub",
  alternates: { canonical: '/cartoons' },
  description: "Мультфильмы — смотрите онлайн в хорошем качестве на Filmhub",
};

export default function Page() {
  return <CatalogPage section="cartoons" />;
}
