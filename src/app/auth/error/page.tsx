"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      router.replace(`/register?error=${error}`);
    } else {
      router.replace("/register");
    }
  }, [error, router]);

  return <div>Redirecting...</div>;
}
