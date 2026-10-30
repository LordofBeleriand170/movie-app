"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useAuthStore } from "@/features/auth/authStore";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { login, user, error } = useAuthStore();

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      toast.error("Please fill in all fields", {
        style: {
          background: "#121212",
          color: "#ffffff",
          border: "1px solid #2a2a2a",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        },
        iconTheme: {
          primary: "#E50914",
          secondary: "#ffffff",
        },
      });
      return;
    }

    try {
      setLoading(true);
      await login(username, password, callbackUrl);

      if (!user) {
        toast.error("Failed to load session after login", {
          style: {
            background: "#121212",
            color: "#ffffff",
            border: "1px solid #2a2a2a",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
          },
          iconTheme: {
            primary: "#E50914",
            secondary: "#ffffff",
          },
        });
        return;
      }

      toast.success("Logged in successfully", {
        style: {
          background: "#121212",
          color: "#ffffff",
          border: "1px solid #2a2a2a",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        },
        iconTheme: {
          primary: "#22c55e",
          secondary: "#ffffff",
        },
      });
      router.refresh();

      toast.error(error, {
        style: {
          background: "#121212",
          color: "#ffffff",
          border: "1px solid #2a2a2a",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        },
        iconTheme: {
          primary: "#E50914",
          secondary: "#ffffff",
        },
      });

      if (
        error === "User not verified" ||
        error === "Verification code expired and new code has been sent"
      ) {
        router.push("/verify");
      }
    } catch (err) {
      console.log("ERR", err);
      toast.error(error, {
        style: {
          background: "#121212",
          color: "#ffffff",
          border: "1px solid #2a2a2a",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        },
        iconTheme: {
          primary: "#E50914",
          secondary: "#ffffff",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  /*  <button
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
          </button>*/

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#09090b] text-white px-4">
      <div className="w-full max-w-md bg-[#111216] border border-zinc-900 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold tracking-wide">Login</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Welcome back! Enter your credentials to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 cursor-pointer bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 text-white font-semibold text-sm rounded-full transition shadow-lg shadow-red-950/40 active:scale-[0.98]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-xs text-zinc-400 text-center">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-red-500  hover:text-red-400 hover:underline font-medium ml-1 cursor-pointer"
          >
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginForm;
