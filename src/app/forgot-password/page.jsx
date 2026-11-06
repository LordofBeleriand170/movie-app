"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ToastComponent";
import { useAuthStore } from "@/features/auth/authStore";

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const forgotPassword = useAuthStore((state) => state.forgotPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier) {
      showToast("error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(identifier);

      if (res?.user) {
        showToast("success", "Password reset.");
        setCountdown(60);
      } else {
        showToast("error", res?.error);
      }

      showToast(
        "success",
        "Password reset initiated successfully. You wil be redirected to reset page",
      );

      router.push(`/reset-password?${identifier}`);
    } catch (err) {
      showToast("error", err?.message || "Failed to send reset instructions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#09090b] text-white px-4">
      <div className="w-full max-w-md bg-[#111216] border border-zinc-900 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold tracking-wide">Forgot Password</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Enter your username or email to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="identifier"
              className="text-xs font-medium text-zinc-300 ml-1"
            >
              Username or Email
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              placeholder="Username or email..."
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#14151a] border border-zinc-800 rounded-full focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 text-sm text-white placeholder-zinc-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 cursor-pointer bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 text-white font-semibold text-sm rounded-full transition shadow-lg shadow-red-950/40 active:scale-[0.98]"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-6 text-xs text-zinc-400 text-center">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-red-500 hover:text-red-400 hover:underline font-medium ml-1 cursor-pointer"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default ForgotPassword;
