"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import PasswordStrength from "@/components/PasswordStrength";
import { getStrength } from "../utils/passwordStrength";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const strength = getStrength(formData.password);

  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!hasShownToast.current && error === "account_link_conflict") {
      toast.error("This email is already used by a credentials account.");
      hasShownToast.current = true;
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email) {
      toast.error("Please enter both username and email");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (strength !== 4) {
      toast.error("Password is not strong enough");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      } else {
        router.push("/verify");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Error occurred during registration";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#09090b] text-white px-4">
      {/* Compact Multi-Step Card */}
      <div className="w-full max-w-md bg-[#111216] border border-zinc-900 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Step Indicator Header */}
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold tracking-wide">
            {step === 1 ? "Create Account" : "Set Password"}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Step {step} of 2 — {step === 1 ? "Basic Details" : "Security Check"}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-red-600 h-full transition-all duration-300 ease-in-out"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>
        </div>

        {/* STEP 1: Username & Email */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="flex flex-col gap-4">
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
                htmlFor="email"
                className="text-xs font-medium text-zinc-300 ml-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email..."
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-[#14151a] border border-zinc-800 rounded-full focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 text-sm text-white placeholder-zinc-500 transition-colors"
                required
              />
            </div>

            {/* Google Fast Track */}
            <button
              type="button"
              onClick={() => signIn("google")}
              className="w-full mt-1 py-2.5 bg-white text-zinc-900 font-medium text-sm rounded-full flex items-center justify-center gap-2 hover:bg-zinc-200 transition active:scale-[0.98]"
            >
              <Image
                src="/google-logo.jpg"
                alt="Google"
                width={18}
                height={18}
                className="object-contain"
              />
              Register with Google
            </button>

            {/* Next Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm rounded-full transition shadow-lg shadow-red-950/40 active:scale-[0.98]"
            >
              Continue &rarr;
            </button>
          </form>
        )}

        {/* STEP 2: Password & Confirm Password */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-medium text-zinc-300 ml-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password..."
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-[#14151a] border border-zinc-800 rounded-full focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 text-sm text-white placeholder-zinc-500 transition-colors"
                required
              />
            </div>

            {/* Password Strength Indicator */}
            <div className="my-1">
              <PasswordStrength password={formData.password} />
            </div>

            {/* Step 2 Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-sm rounded-full transition active:scale-[0.98]"
              >
                &larr; Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 text-white font-semibold text-sm rounded-full transition shadow-lg shadow-red-950/40 active:scale-[0.98]"
              >
                {loading ? "Registering..." : "Complete Registration"}
              </button>
            </div>
          </form>
        )}

        <p className="mt-6 text-xs text-zinc-400 text-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-red-500 hover:text-red-400 hover:underline font-medium ml-1"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterForm;
