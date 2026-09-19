import InfoComponent from "@/components/InfoComponent";

interface Params {
  type: string;
  slug: string;
}

export default async function Page({ params }: { params: Params }) {
  // Ensure you await params if it's an async resource
  const { type, slug } = await params;

  return <InfoComponent option={slug} type={type} />;
}
