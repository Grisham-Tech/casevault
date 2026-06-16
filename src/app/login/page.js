"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        // Register new user
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error);
          setLoading(false);
          return;
        }

        // After registering, log them in automatically
        await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: false,
        });

        router.push("/");
      } else {
        // Login existing user
        const result = await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid email or password");
          setLoading(false);
          return;
        }

        router.push("/");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#061020] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-white">
            Case<span className="text-[#c9a84c]">Vault</span>
          </Link>
          <p className="text-gray-400 mt-2 text-sm">
            {isRegister ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0f2137] border border-[#1e3a5f] rounded-2xl p-8">

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div onSubmit={handleSubmit}>

            {/* Name field only for register */}
            {isRegister && (
              <div className="mb-4">
                <label className="text-gray-400 text-sm mb-2 block">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full bg-[#061020] border border-[#1e3a5f] text-white px-4 py-3 rounded-xl outline-none placeholder-gray-600 focus:border-[#c9a84c] transition"
                />
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-[#061020] border border-[#1e3a5f] text-white px-4 py-3 rounded-xl outline-none placeholder-gray-600 focus:border-[#c9a84c] transition"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="text-gray-400 text-sm mb-2 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-[#061020] border border-[#1e3a5f] text-white px-4 py-3 rounded-xl outline-none placeholder-gray-600 focus:border-[#c9a84c] transition"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#c9a84c] text-[#0a1628] font-bold py-3 rounded-xl hover:bg-[#b8973b] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Please wait..."
                : isRegister
                ? "Create Account"
                : "Sign In"}
            </button>
          </div>

          {/* Toggle between login and register */}
          <p className="text-center text-gray-400 text-sm mt-6">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => { setIsRegister(!isRegister); setError(""); }}
              className="text-[#c9a84c] hover:underline font-medium"
            >
              {isRegister ? "Sign In" : "Register"}
            </button>
          </p>
        </div>

        {/* Back to home */}
        <p className="text-center mt-6">
          <Link href="/" className="text-gray-500 text-sm hover:text-gray-300 transition">
            ← Back to Gallery
          </Link>
        </p>
      </div>
    </div>
  );
}