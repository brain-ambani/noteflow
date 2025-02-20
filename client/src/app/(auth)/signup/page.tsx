"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function SignupPage() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setError(""); // Reset errors
    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(Response.error);

      router.push("/verify"); // Redirect to verification page
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("name", { required: true })}
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border rounded"
          />
          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded">
            Sign Up
          </button>
        </form>
        <p className="text-sm mt-2">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
