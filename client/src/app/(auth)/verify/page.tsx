"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function VerifyEmailPage() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setError(""); // Reset errors
    try {
      const res = await fetch(
        "http://localhost:8000/api/v1/auth/verify-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error("Invalid verification code");

      router.push("/login"); // Redirect to login page
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Verify Your Email</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          <input
            {...register("verificationCode", { required: true })}
            type="text"
            placeholder="Verification Code"
            className="w-full p-2 border rounded"
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded">
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
}
