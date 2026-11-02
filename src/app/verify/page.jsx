"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/authStore";
import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { showToast } from "@/components/ToastComponent";

const VerifyPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const router = useRouter();
  const verifyEmail = useAuthStore((state) => state.verifyEmail);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const verificationCode = code.join("");

    try {
      const res = await verifyEmail(verificationCode);
      if (res?.user) {
        showToast("success", "User verified");
        router.push("/login");
      } else {
        showToast("error", res?.error);
      }
    } catch (err) {
      const errorMessage = "Error occurred during registration.";
      showToast("error", errorMessage);
    }
  };

  const setInputRef = (index) => (el) => {
    inputRefs.current[index] = el;
  };

  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = code
        .slice()
        .reverse()
        .findIndex((digit) => digit !== "");
      const adjustedIndex =
        lastFilledIndex === -1 ? -1 : newCode.length - lastFilledIndex - 1;
      const focusIndex = adjustedIndex < 5 ? adjustedIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && !code[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit();
    }
  }, [code]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0e0e11] border border-neutral-800/80 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex items-start justify-between border-b border-neutral-800/80 pb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Verify your email
            </h2>
            <p className="text-xs text-neutral-400">
              Enter the 6-digit code sent to your email address
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="text-neutral-500 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2 sm:gap-3 justify-center w-full my-2">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                ref={setInputRef(index)}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-[#16161a] text-white border border-neutral-800 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all duration-200"
              />
            ))}
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-xs cursor-pointer font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 cursor-pointer rounded-full text-xs font-bold bg-[#ff0015] hover:bg-red-600 text-white transition-all duration-200 shadow-lg shadow-red-600/30"
            >
              Verify Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyPage;
