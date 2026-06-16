"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SlideCard from "@/components/SlideCard";

const CATEGORIES = ["All", "Strategy", "Finance", "Marketing", "Social Impact"];
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

  // Fetch slides whenever filters change
  useEffect(() => {
    fetchSlides();
  }, [search, category, sort, page]);

  async function fetchSlides() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 9,
        sort,
        ...(search && { search }),
        ...(category && { category }),
      });

      const res = await fetch(`/api/slides?${params}`);
      const data = await res.json();

      setSlides(data.slides);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch slides:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#061020]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* Hero Section */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-white mb-3">
            The Gallery
          </h1>
          <p className="text-gray-400 text-lg">
            Curated excellence from top-tier global case competitions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title, description or tags..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-[#0f2137] border border-[#1e3a5f] text-white px-5 py-3 rounded-xl outline-none placeholder-gray-500 focus:border-[#c9a84c] transition"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat === "All" ? "" : cat); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  (cat === "All" && !category) || category === cat
                    ? "bg-[#c9a84c] text-[#0a1628]"
                    : "bg-[#0f2137] text-gray-400 hover:text-white border border-[#1e3a5f]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="bg-[#0f2137] border border-[#1e3a5f] text-white text-sm px-3 py-2 rounded-lg outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Slides Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-[#c9a84c] text-xl animate-pulse">Loading slides...</div>
          </div>
        ) : slides.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-gray-400 text-xl mb-2">No slides found</p>
            <p className="text-gray-600 text-sm">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide) => (
              <SlideCard key={slide._id} slide={slide} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-[#0f2137] text-white rounded-lg disabled:opacity-40 hover:bg-[#1e3a5f] transition"
            >
              Previous
            </button>
            <span className="text-gray-400 text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-[#0f2137] text-white rounded-lg disabled:opacity-40 hover:bg-[#1e3a5f] transition"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0a1628] border-t border-[#1e3a5f] mt-20 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-2xl font-bold text-white">
            Case<span className="text-[#c9a84c]">Vault</span>
          </span>
          <p className="text-gray-500 text-sm">© 2026 CaseVault. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}