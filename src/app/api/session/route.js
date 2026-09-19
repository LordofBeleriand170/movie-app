import { useSession } from "next-auth/react";

export const MyComponent = () => {
  const { data: session, status } = useSession();
  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Not signed in</p>;

  return <p>Signed in as {session.user.email}</p>;
};
