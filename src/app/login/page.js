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
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error); setLoading(false); return; }
        await signIn("credentials", { email: form.email, password: form.password, redirect: false });
        router.push("/");
      } else {
        const result = await signIn("credentials", {
          email: form.email, password: form.password, redirect: false,
        });
        if (result?.error) { setError("Invalid email or password"); setLoading(false); return; }
        router.push("/");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    padding: "12px 14px",
    color: "#fff", fontSize: "14px",
    outline: "none", marginTop: "6px",
  };

  const labelStyle = {
    color: "rgba(255,255,255,0.4)",
    fontSize: "12px", fontWeight: "500",
    textTransform: "uppercase", letterSpacing: "0.05em",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#080614",
      display: "flex", alignItems: "center",
      justifyContent: "center", padding: "24px",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: "28px", fontWeight: "600", color: "#fff" }}>
              Case<span style={{ color: "#a78bfa" }}>Vault</span>
            </span>
          </Link>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", marginTop: "8px" }}>
            {isRegister ? "Create your account" : "Welcome back"}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#13102a",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: "16px", padding: "32px",
        }}>

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)",
              border: "0.5px solid rgba(239,68,68,0.3)",
              color: "#f87171", fontSize: "13px",
              padding: "12px 14px", borderRadius: "8px",
              marginBottom: "20px",
            }}>
              {error}
            </div>
          )}

          {/* Name field */}
          {isRegister && (
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text" name="name"
                value={form.name} onChange={handleChange}
                placeholder="John Doe" required style={inputStyle}
              />
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email" name="email"
              value={form.email} onChange={handleChange}
              placeholder="you@example.com" required style={inputStyle}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password" name="password"
              value={form.password} onChange={handleChange}
              placeholder="••••••••" required style={inputStyle}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg, #7c3aed, #4f46e5)",
              color: "#fff", fontWeight: "500",
              fontSize: "14px", padding: "12px",
              borderRadius: "10px", border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
          </button>

          {/* Toggle */}
          <p style={{
            textAlign: "center", fontSize: "13px",
            color: "rgba(255,255,255,0.3)", marginTop: "20px",
          }}>
            {isRegister ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => { setIsRegister(!isRegister); setError(""); }}
              style={{
                background: "none", border: "none",
                color: "#a78bfa", cursor: "pointer",
                fontSize: "13px", fontWeight: "500",
              }}
            >
              {isRegister ? "Sign In" : "Register"}
            </button>
          </p>
        </div>

        {/* Back */}
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          <Link href="/" style={{
            color: "rgba(255,255,255,0.2)",
            fontSize: "13px", textDecoration: "none",
          }}>
            ← Back to Gallery
          </Link>
        </p>
      </div>
    </div>
  );
}