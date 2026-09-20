import InfoComponent from "@/components/InfoComponent";

export default async function Page({ params }) {
  // Ensure you await params if it's an async resource
  const { type, slug } = await params;

  return <InfoComponent option={slug} type={type} />;
}
