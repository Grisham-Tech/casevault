"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SlideCard from "@/components/SlideCard";

const CATEGORIES = ["All", "Strategy", "Finance", "Marketing", "Social Impact", "Operations", "Technology"];
const SORT_OPTIONS = [
  { label: "Latest Submissions", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Title A-Z", value: "title" },
];

export default function Home() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => { fetchSlides(); }, [search, category, sort, page]);

  async function fetchSlides() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page, limit: 9, sort,
        ...(search && { search }),
        ...(category && { category }),
      });
      const res = await fetch(`/api/slides?${params}`);
      const data = await res.json();
      setSlides(data.slides);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080614" }}>
      <Navbar />

      {/* Hero */}
      <div style={{
        background: "#0f0a1e",
        padding: "56px 24px 40px",
        borderBottom: "0.5px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(124,58,237,0.12)",
            border: "0.5px solid rgba(124,58,237,0.3)",
            color: "#a78bfa", fontSize: "12px",
            padding: "4px 14px", borderRadius: "20px",
            marginBottom: "16px",
          }}>
            ✦ Case Competition Gallery
          </div>
          <h1 style={{
            fontSize: "42px", fontWeight: "600",
            color: "#fff", marginBottom: "10px", lineHeight: "1.2",
          }}>
            Explore{" "}
            <span style={{
              background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Elite Solutions
            </span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px" }}>
            Curated excellence from top-tier global case competitions across disciplines.
          </p>

          {/* Search */}
          <div style={{ position: "relative", marginTop: "28px", maxWidth: "520px" }}>
            <span style={{
              position: "absolute", left: "14px", top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255,255,255,0.25)", fontSize: "15px",
            }}>⌕</span>
            <input
              type="text"
              placeholder="Search by title, tags, or description..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "0.5px solid rgba(255,255,255,0.12)",
                borderRadius: "10px",
                padding: "12px 14px 12px 38px",
                color: "#fff", fontSize: "14px",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: "#0f0a1e",
        padding: "16px 24px",
        borderBottom: "0.5px solid rgba(255,255,255,0.06)",
        position: "sticky", top: "57px", zIndex: 40,
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
        }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => {
              const isActive = (cat === "All" && !category) || category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat === "All" ? "" : cat); setPage(1); }}
                  style={{
                    background: isActive ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)",
                    border: isActive ? "0.5px solid rgba(124,58,237,0.5)" : "0.5px solid rgba(255,255,255,0.1)",
                    color: isActive ? "#a78bfa" : "rgba(255,255,255,0.45)",
                    fontSize: "12px", padding: "6px 14px",
                    borderRadius: "20px", cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px" }}>
              {total} results
            </span>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "0.5px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)",
                fontSize: "12px", padding: "6px 12px",
                borderRadius: "8px", outline: "none", cursor: "pointer",
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} style={{ background: "#13102a", color: "#fff" }}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {loading ? (
          <div style={{
            display: "flex", justifyContent: "center",
            alignItems: "center", height: "300px",
          }}>
            <div style={{
              width: "36px", height: "36px",
              border: "2px solid rgba(124,58,237,0.2)",
              borderTop: "2px solid #a78bfa",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
          </div>
        ) : slides.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 24px",
            color: "rgba(255,255,255,0.25)",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⊘</div>
            <p style={{ fontSize: "16px" }}>No slides found</p>
            <p style={{ fontSize: "13px", marginTop: "6px" }}>
              Try a different search or category
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
          }}>
            {slides.map((slide) => (
              <SlideCard
                key={slide._id}
                slide={slide}
                onDelete={(id) => setSlides((prev) => prev.filter((s) => s._id !== id))}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: "flex", justifyContent: "center",
            alignItems: "center", gap: "12px", marginTop: "48px",
          }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "0.5px solid rgba(255,255,255,0.1)",
                color: page === 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)",
                padding: "8px 18px", borderRadius: "8px",
                cursor: page === 1 ? "not-allowed" : "pointer",
                fontSize: "13px",
              }}
            >
              ← Previous
            </button>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "0.5px solid rgba(255,255,255,0.1)",
                color: page === totalPages ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)",
                padding: "8px 18px", borderRadius: "8px",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                fontSize: "13px",
              }}
            >
              Next →
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: "#0f0a1e",
        borderTop: "0.5px solid rgba(255,255,255,0.06)",
        padding: "28px 24px", marginTop: "40px",
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: "18px", fontWeight: "600", color: "#fff" }}>
            Case<span style={{ color: "#a78bfa" }}>Vault</span>
          </span>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>
            © 2026 CaseVault. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}