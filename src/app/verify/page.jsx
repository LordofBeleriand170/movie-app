"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/authStore";
import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const VerifyPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const router = useRouter();
  const verifyEmail = useAuthStore((state) => state.verifyEmail);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    try {
      const res = await verifyEmail(verificationCode);
      if (res?.user) {
        toast.success("User verified");
        router.push("/login");
      } else {
        toast.error(res?.error, {
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
      }
    } catch (err) {
      const errorMessage = "Error occurred during registration.";
      toast.error(errorMessage);
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
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div className="flex flex-col space-y-4 max-w-sm mx-auto p-4">
      <div className="flex flex-col gap-5 w-100">
        <h2>Verify Email</h2>
        <form
          onSubmit={handleSubmit}
          className="flex gap-3 relative justify-center w-full"
        >
          {code.map((digit, index) => (
            <input
              type="text"
              key={index}
              maxLength={1}
              value={digit}
              ref={setInputRef(index)}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-2xl font-bold bg-blue-900 text-white border-2 border-white rounded-lg focus:border-green-500 focus:outline-none"
            />
          ))}
        </form>
      </div>
    </div>
  );
};

export default VerifyPage;
