import InfoComponent from "@/components/InfoComponent";

export default async function Page({ params }) {
  const { type, slug } = await params;

  return <InfoComponent option={slug} type={type} />;
}
