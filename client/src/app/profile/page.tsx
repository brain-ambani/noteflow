"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          ← Back to Dashboard
        </button>

        <h2 className="text-xl font-semibold mb-4">User Profile</h2>
        {user ? (
          <>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
