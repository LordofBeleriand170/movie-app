"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/features/auth/authStore";
import { showToast } from "@/components/ToastComponent";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get("identifier");

  const resetPassword = useAuthStore((state) => state.resetPassword);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
      showToast("error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      showToast("error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword(identifier, password);

      if (res?.error) {
        showToast("error", res.error);
        return;
      }

      showToast("success", "Password reset successfully. Please log in.");
      router.push("/login");
    } catch (err) {
      showToast("error", err?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#09090b] text-white px-4">
      <div className="w-full max-w-md bg-[#111216] border border-zinc-900 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold tracking-wide">Reset Password</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium text-zinc-300 ml-1"
            >
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="New password..."
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-[#14151a] border border-zinc-800 rounded-full focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 text-sm text-white placeholder-zinc-500 transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-xs font-medium text-zinc-300 ml-1"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password..."
              value={formData.confirmPassword}
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default ResetPassword;
