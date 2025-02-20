"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse user details from localStorage
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user"); // Clear user data
    router.push("/login");
  };

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">Dashboard</h1>

      {/* Profile Icon with Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 bg-white text-black px-3 py-1 rounded-lg"
        >
          <span>{user?.name || "User"}</span>
          <img
            src="/profile-icon.png" // Replace with actual profile image if available
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
            <button
              onClick={() => router.push("/profile")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              User Profile
            </button>
            <button
              onClick={() => router.push("/plan")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Plan
            </button>
            <button
              onClick={() => router.push("/settings")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
