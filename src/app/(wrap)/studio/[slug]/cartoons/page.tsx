import StudioPage from "@/components/StudioPage/StudioPage";

/* Тип контента задаётся адресом — у каждого свой адрес и своя выдача */
export default function Page({ params }: { params: { slug: string } }) {
  return <StudioPage params={{ slug: params.slug }} type="3" />;
}
