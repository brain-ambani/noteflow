"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const router = useRouter();

  // Redirect if already logged in
  //   useEffect(() => {
  //     const token = localStorage.getItem("accessToken");
  //     if (token) router.push("/dashboard");
  //   }, [router]);

  const onSubmit = async (data: any) => {
    setError(""); // Reset errors
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const responseData = await res.json();
      console.log("Response from Backend:", responseData); // Debugging log

      if (!res.ok) {
        console.error("Login Error:", responseData); // Log exact error response
        throw new Error(responseData.message || "Invalid credentials");
      }

      // Ensure accessToken exists before storing
      if (!responseData.token) {
        throw new Error("No access token received from server");
      }

      localStorage.setItem("accessToken", responseData.token); // Store token
      localStorage.setItem("user", JSON.stringify(responseData.user)); // Store user data
      router.push("/dashboard"); // Redirect to dashboard
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            Login
          </button>
        </form>
        <p className="text-sm mt-2">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
