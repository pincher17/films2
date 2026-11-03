import type { Metadata } from "next";
import CatalogPage from "@/components/CatalogPage/CatalogPage";

export const metadata: Metadata = {
  title: "Все сериалы смотреть онлайн на Filmhub",
  description: "Все сериалы — смотрите онлайн в хорошем качестве на Filmhub",
};

export default function Page() {
  return <CatalogPage section="series" />;
}
