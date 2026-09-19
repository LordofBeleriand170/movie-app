import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  console.log("🔍 Server-side session:", session);
  return new Response(JSON.stringify(session), { status: 200 });
}
