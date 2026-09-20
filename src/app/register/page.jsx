"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import PasswordStrength from "@/components/PasswordStrength";
import { getStrength } from "../utils/passwordStrength";

const RegisterFormContent = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const strength = getStrength(formData.password);

  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!hasShownToast.current && error === "account_link_conflict") {
      toast.error("This email is already used by a credentials account.", {
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
      hasShownToast.current = true;
    }
  }, [error]);

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email) {
      toast.error("Please enter both username and email", {
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
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
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

    if (strength !== 4) {
      toast.error("Password is not strong enough", {
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
        toast.success("User created successfully", {
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
        router.push("/verify");
      }
    } catch (err) {
      toast.error(err.message || "Error occurred during registration", {
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
  }; /*   <button
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
            </button>*/

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#09090b] text-white px-4">
      <div className="w-full max-w-md bg-[#111216] border border-zinc-900 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold tracking-wide">
            {step === 1 ? "Create Account" : "Set Password"}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Step {step} of 2 — {step === 1 ? "Basic Details" : "Security Check"}
          </p>

          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-red-600 h-full transition-all duration-300 ease-in-out"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>
        </div>

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

            <button
              type="submit"
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm rounded-full transition shadow-lg shadow-red-950/40 active:scale-[0.98]"
            >
              Continue &rarr;
            </button>
          </form>
        )}

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

            <div className="my-1">
              <PasswordStrength password={formData.password} />
            </div>

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

export default function RegisterForm() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen w-full flex items-center justify-center bg-[#09090b] text-white">
          <div className="text-zinc-400 text-sm">
            Loading registration form...
          </div>
        </main>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
