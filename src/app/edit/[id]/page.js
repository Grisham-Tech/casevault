"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const CATEGORIES = ["Strategy", "Finance", "Marketing", "Social Impact", "Operations", "Technology"];
const YEARS = Array.from({ length: 10 }, (_, i) => 2026 - i);

export default function EditSlidePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: "", description: "", category: "Strategy",
    competitionName: "", year: "2026", tags: "",
  });

  // Fetch the existing slide data on load
  useEffect(() => {
    async function fetchSlide() {
      try {
        const res = await fetch(`/api/slides/${params.id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Slide not found");
          setLoading(false);
          return;
        }

        setForm({
          title: data.slide.title,
          description: data.slide.description,
          category: data.slide.category,
          competitionName: data.slide.competitionName,
          year: String(data.slide.year),
          tags: data.slide.tags.join(", "),
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load slide");
        setLoading(false);
      }
    }
    fetchSlide();
  }, [params.id]);

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [status, session, router]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/slides/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          competitionName: form.competitionName,
          year: parseInt(form.year),
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update slide");
        setSaving(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      setError("Something went wrong");
      setSaving(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#080614", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#a78bfa" }}>Loading...</div>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: "10px", padding: "11px 14px",
    color: "#fff", fontSize: "14px", outline: "none",
  };

  const labelStyle = {
    color: "rgba(255,255,255,0.4)", fontSize: "11px",
    fontWeight: "500", textTransform: "uppercase",
    letterSpacing: "0.06em", display: "block", marginBottom: "8px",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080614" }}>
      <Navbar />

      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: "36px" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(124,58,237,0.12)",
            border: "0.5px solid rgba(124,58,237,0.3)",
            color: "#a78bfa", fontSize: "12px",
            padding: "4px 14px", borderRadius: "20px", marginBottom: "16px",
          }}>
            ✦ Edit Submission
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#fff", marginBottom: "8px" }}>
            Update Your Slide
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px" }}>
            Make changes to your case competition entry's details.
          </p>
        </div>

        {success && (
          <div style={{
            background: "rgba(16,185,129,0.1)",
            border: "0.5px solid rgba(16,185,129,0.3)",
            color: "#34d399", padding: "14px 18px",
            borderRadius: "10px", marginBottom: "24px",
            fontSize: "14px", textAlign: "center",
          }}>
            ✓ Slide updated successfully! Redirecting...
          </div>
        )}

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "0.5px solid rgba(239,68,68,0.3)",
            color: "#f87171", padding: "14px 18px",
            borderRadius: "10px", marginBottom: "24px", fontSize: "14px",
          }}>
            {error}
          </div>
        )}

        <div style={{
          background: "#13102a",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: "16px", padding: "32px",
          display: "flex", flexDirection: "column", gap: "22px",
        }}>

          <div>
            <label style={labelStyle}>Case Title</label>
            <input type="text" name="title" value={form.title}
              onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Competition Name</label>
              <input type="text" name="competitionName" value={form.competitionName}
                onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Year</label>
              <select name="year" value={form.year} onChange={handleChange} style={inputStyle}>
                {YEARS.map((y) => (
                  <option key={y} value={y} style={{ background: "#13102a", color: "#fff" }}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Category</label>
            <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} style={{ background: "#13102a", color: "#fff" }}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Tags</label>
            <input type="text" name="tags" value={form.tags} onChange={handleChange}
              placeholder="e.g., growth, emerging markets, B2B" style={inputStyle} />
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", marginTop: "6px" }}>
              Separate with commas
            </p>
          </div>

          <div>
            <label style={labelStyle}>Executive Summary</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              required rows={4} style={{ ...inputStyle, resize: "none", lineHeight: "1.6" }} />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "14px", paddingTop: "8px" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", textDecoration: "none" }}>
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={saving}
              style={{
                background: saving ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg, #7c3aed, #4f46e5)",
                color: "#fff", fontWeight: "500",
                fontSize: "14px", padding: "11px 28px",
                borderRadius: "10px", border: "none",
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}