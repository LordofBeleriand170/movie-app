"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useAuthStore } from "@/features/auth/authStore";

interface LoginFormData {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.ok) {
        const sessionRes = await fetch("/api/auth/session");
        const updatedSession = await sessionRes.json();

        if (!updatedSession?.user) {
          toast.error("Failed to load session after login");
          return;
        }

        setUser({
          id: updatedSession.user.id,
          username: updatedSession.user.username,
          email: updatedSession.user.email,
          moviesUserId: updatedSession.user.moviesUserId,
          password: "",
          isVerified: false,
          favorite: [],
          watchlist: [],
          ratings: [],
          reviews: [],
        });

        toast.success("Logged in successfully");
        router.refresh();
        router.replace("/");
      } else {
        const error = res?.error || "Login failed";
        toast.error(error);

        if (
          error === "User not verified" ||
          error === "Verification code expired and new code has been sent"
        ) {
          router.push("/verify");
        }
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#09090b] text-white px-4">
      {/* Container Panel */}
      <div className="w-full max-w-md bg-[#111216] border border-zinc-900 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold tracking-wide">Login</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Welcome back! Enter your credentials to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Username Input */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-xs font-medium text-zinc-300 ml-1"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username..."
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-[#14151a] border border-zinc-800 rounded-full focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 text-sm text-white placeholder-zinc-500 transition-colors"
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium text-zinc-300 ml-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password..."
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-[#14151a] border border-zinc-800 rounded-full focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 text-sm text-white placeholder-zinc-500 transition-colors"
              required
            />
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={() => signIn("google")}
            className="w-full mt-2 py-2.5 cursor-pointer bg-white text-zinc-900 font-medium text-sm rounded-full flex items-center justify-center gap-2 hover:bg-zinc-200 transition active:scale-[0.98]"
          >
            <Image
              src="/google-logo.jpg"
              alt="Google"
              width={18}
              height={18}
              className="object-contain"
            />
            Sign in with Google
          </button>

          {/* Lighter Red Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 cursor-pointer bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 text-white font-semibold text-sm rounded-full transition shadow-lg shadow-red-950/40 active:scale-[0.98]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Lighter Red Link */}
        <p className="mt-6 text-xs text-zinc-400 text-center">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-red-500 hover:text-red-400 hover:underline font-medium ml-1 cursor-pointer"
          >
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginForm;
