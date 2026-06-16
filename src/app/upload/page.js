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

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Strategy",
    competitionName: "",
    year: "2026",
    tags: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [slideFile, setSlideFile] = useState(null);
  const [previewName, setPreviewName] = useState("");
  const [slideName, setSlideName] = useState("");

  // Redirect if not logged in
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#061020] flex items-center justify-center">
        <p className="text-[#c9a84c] animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!previewImage || !slideFile) {
      setError("Please upload both a preview image and a slide file");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("competitionName", form.competitionName);
      formData.append("year", form.year);
      formData.append("tags", form.tags);
      formData.append("previewImage", previewImage);
      formData.append("slideFile", slideFile);

      const res = await fetch("/api/slides", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#061020]">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            Curate Your Work
          </h1>
          <p className="text-gray-400">
            Submit your strategic analysis to the vault.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-4 rounded-xl mb-6 text-center">
            ✓ Slide uploaded successfully! Redirecting to gallery...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="bg-[#0f2137] border border-[#1e3a5f] rounded-2xl p-8 space-y-6">

          {/* Slide File Upload */}
          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3 block">
              Case Materials (PDF)
            </label>
            <div
              onClick={() => document.getElementById("slideFile").click()}
              className="border-2 border-dashed border-[#1e3a5f] hover:border-[#c9a84c] rounded-xl p-10 text-center cursor-pointer transition"
            >
              <p className="text-4xl mb-3">☁</p>
              <p className="text-white font-medium">
                {slideName || "Drag and drop slides here"}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                or click to browse (.pdf, .pptx)
              </p>
            </div>
            <input
              id="slideFile"
              type="file"
              accept=".pdf,.pptx"
              className="hidden"
              onChange={(e) => {
                setSlideFile(e.target.files[0]);
                setSlideName(e.target.files[0]?.name || "");
              }}
            />
          </div>

          {/* Preview Image */}
          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3 block">
              Preview Thumbnail
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-16 bg-[#061020] border border-[#1e3a5f] rounded-lg flex items-center justify-center overflow-hidden">
                {previewImage ? (
                  <img
                    src={URL.createObjectURL(previewImage)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 text-xs">Preview</span>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => document.getElementById("previewImage").click()}
                  className="bg-[#1e3a5f] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#c9a84c] hover:text-[#0a1628] transition"
                >
                  Choose File
                </button>
                <p className="text-gray-500 text-xs mt-1">
                  {previewName || "Optimal ratio 16:9, Max 5MB"}
                </p>
              </div>
            </div>
            <input
              id="previewImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                setPreviewImage(e.target.files[0]);
                setPreviewName(e.target.files[0]?.name || "");
              }}
            />
          </div>

          {/* Title */}
          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">
              Case Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter a prestigious title..."
              required
              className="w-full bg-[#061020] border border-[#1e3a5f] text-white px-4 py-3 rounded-xl outline-none placeholder-gray-600 focus:border-[#c9a84c] transition"
            />
          </div>

          {/* Competition Name + Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">
                Competition Name
              </label>
              <input
                type="text"
                name="competitionName"
                value={form.competitionName}
                onChange={handleChange}
                placeholder="e.g., Global Strategy Case 2026"
                required
                className="w-full bg-[#061020] border border-[#1e3a5f] text-white px-4 py-3 rounded-xl outline-none placeholder-gray-600 focus:border-[#c9a84c] transition"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">
                Year
              </label>
              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                className="w-full bg-[#061020] border border-[#1e3a5f] text-white px-4 py-3 rounded-xl outline-none focus:border-[#c9a84c] transition"
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-[#061020] border border-[#1e3a5f] text-white px-4 py-3 rounded-xl outline-none focus:border-[#c9a84c] transition"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g., growth, emerging markets, B2B"
              className="w-full bg-[#061020] border border-[#1e3a5f] text-white px-4 py-3 rounded-xl outline-none placeholder-gray-600 focus:border-[#c9a84c] transition"
            />
            <p className="text-gray-600 text-xs mt-1">Separate tags with commas</p>
          </div>

          {/* Description */}
          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">
              Executive Summary
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Provide a concise summary of the case problem and your strategic solution..."
              required
              rows={4}
              className="w-full bg-[#061020] border border-[#1e3a5f] text-white px-4 py-3 rounded-xl outline-none placeholder-gray-600 focus:border-[#c9a84c] transition resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 pt-2">
            <Link
              href="/"
              className="text-gray-400 text-sm hover:text-white transition"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#c9a84c] text-[#0a1628] font-bold px-8 py-3 rounded-xl hover:bg-[#b8973b] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Uploading..." : "⬆ Publish to Vault"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}