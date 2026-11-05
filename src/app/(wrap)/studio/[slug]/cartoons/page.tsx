import type { Metadata } from "next";
import { allStudios } from "@/data/AllStudios";

/** Название студии из адреса: иначе у всех студий был общий заголовок сайта */
function studioName(slug: string) {
  return allStudios.find((studio) => studio.slug === slug)?.label || slug;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const name = studioName(params.slug);
  return {
    title: `${name} — мультфильмы смотреть онлайн на Filmhub`,
    description: `${name} — мультфильмы смотрите онлайн в хорошем качестве на Filmhub`,
    alternates: { canonical: `/studio/${params.slug}/cartoons` },
  };
}

import StudioPage from "@/components/StudioPage/StudioPage";

/* Тип контента задаётся адресом — у каждого свой адрес и своя выдача */
export default function Page({ params }: { params: { slug: string } }) {
  return <StudioPage params={{ slug: params.slug }} type="3" />;
}
