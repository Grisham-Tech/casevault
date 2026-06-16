"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const CATEGORIES = ["Strategy", "Finance", "Marketing", "Social Impact", "Operations", "Technology"];
const YEARS = Array.from({ length: 10 }, (_, i) => 2026 - i);

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [slideFile, setSlideFile] = useState(null);
  const [previewName, setPreviewName] = useState("");
  const [slideName, setSlideName] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", category: "Strategy",
    competitionName: "", year: "2026", tags: "",
  });

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: "#080614", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#a78bfa" }}>Loading...</div>
      </div>
    );
  }

  if (!session) { router.push("/login"); return null; }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!previewImage || !slideFile) {
      setError("Please upload both a preview image and a slide file");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append("previewImage", previewImage);
      formData.append("slideFile", slideFile);

      const res = await fetch("/api/slides", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) { setError(data.error); setLoading(false); return; }

      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
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

        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(124,58,237,0.12)",
            border: "0.5px solid rgba(124,58,237,0.3)",
            color: "#a78bfa", fontSize: "12px",
            padding: "4px 14px", borderRadius: "20px", marginBottom: "16px",
          }}>
            ✦ Submit to Vault
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#fff", marginBottom: "8px" }}>
            Curate Your Work
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px" }}>
            Submit your strategic analysis to the executive vault.
          </p>
        </div>

        {/* Success */}
        {success && (
          <div style={{
            background: "rgba(16,185,129,0.1)",
            border: "0.5px solid rgba(16,185,129,0.3)",
            color: "#34d399", padding: "14px 18px",
            borderRadius: "10px", marginBottom: "24px",
            fontSize: "14px", textAlign: "center",
          }}>
            ✓ Slide uploaded successfully! Redirecting...
          </div>
        )}

        {/* Error */}
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

        {/* Form */}
        <div style={{
          background: "#13102a",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: "16px", padding: "32px",
          display: "flex", flexDirection: "column", gap: "22px",
        }}>

          {/* Slide File */}
          <div>
            <label style={labelStyle}>Case Materials (PDF / PPTX)</label>
            <div
              onClick={() => document.getElementById("slideFile").click()}
              style={{
                border: `1.5px dashed ${slideFile ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "12px", padding: "36px",
                textAlign: "center", cursor: "pointer",
                background: slideFile ? "rgba(124,58,237,0.05)" : "transparent",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "10px" }}>☁</div>
              <p style={{ color: slideFile ? "#a78bfa" : "rgba(255,255,255,0.5)", fontSize: "14px" }}>
                {slideName || "Drag and drop slides here"}
              </p>
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px", marginTop: "4px" }}>
                Click to browse (.pdf, .pptx)
              </p>
            </div>
            <input id="slideFile" type="file" accept=".pdf,.pptx" className="hidden"
              onChange={(e) => { setSlideFile(e.target.files[0]); setSlideName(e.target.files[0]?.name || ""); }}
            />
          </div>

          {/* Preview Image */}
          <div>
            <label style={labelStyle}>Preview Thumbnail</label>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{
                width: "80px", height: "60px",
                background: "rgba(255,255,255,0.04)",
                border: "0.5px solid rgba(255,255,255,0.1)",
                borderRadius: "8px", overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {previewImage ? (
                  <img src={URL.createObjectURL(previewImage)} alt="preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>Preview</span>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => document.getElementById("previewImage").click()}
                  style={{
                    background: "rgba(124,58,237,0.15)",
                    border: "0.5px solid rgba(124,58,237,0.3)",
                    color: "#a78bfa", fontSize: "13px",
                    padding: "8px 16px", borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Choose File
                </button>
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", marginTop: "6px" }}>
                  {previewName || "16:9 ratio recommended, max 5MB"}
                </p>
              </div>
            </div>
            <input id="previewImage" type="file" accept="image/*" className="hidden"
              onChange={(e) => { setPreviewImage(e.target.files[0]); setPreviewName(e.target.files[0]?.name || ""); }}
            />
          </div>

          {/* Title */}
          <div>
            <label style={labelStyle}>Case Title</label>
            <input type="text" name="title" value={form.title}
              onChange={handleChange} placeholder="Enter a prestigious title..."
              required style={inputStyle} />
          </div>

          {/* Competition + Year */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Competition Name</label>
              <input type="text" name="competitionName" value={form.competitionName}
                onChange={handleChange} placeholder="e.g., Global Strategy Case"
                required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Year</label>
              <select name="year" value={form.year} onChange={handleChange} style={inputStyle}>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category</label>
            <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Tags</label>
            <input type="text" name="tags" value={form.tags} onChange={handleChange}
              placeholder="e.g., growth, emerging markets, B2B" style={inputStyle} />
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", marginTop: "6px" }}>
              Separate with commas
            </p>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Executive Summary</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Provide a concise summary of the case problem and your strategic solution..."
              required rows={4}
              style={{ ...inputStyle, resize: "none", lineHeight: "1.6" }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "14px", paddingTop: "8px" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", textDecoration: "none" }}>
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background: loading ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg, #7c3aed, #4f46e5)",
                color: "#fff", fontWeight: "500",
                fontSize: "14px", padding: "11px 28px",
                borderRadius: "10px", border: "none",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Uploading..." : "⬆ Publish to Vault"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}