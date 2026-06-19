"use client";

import Link from "next/link";

import { useSession } from "next-auth/react";
import { useState } from "react";






const CATEGORY_COLORS = {
  Strategy: { bg: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "rgba(124,58,237,0.3)" },
  Finance: { bg: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "rgba(59,130,246,0.3)" },
  Marketing: { bg: "rgba(236,72,153,0.15)", color: "#f472b6", border: "rgba(236,72,153,0.3)" },
  "Social Impact": { bg: "rgba(16,185,129,0.15)", color: "#34d399", border: "rgba(16,185,129,0.3)" },
  Operations: { bg: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "rgba(245,158,11,0.3)" },
  Technology: { bg: "rgba(6,182,212,0.15)", color: "#22d3ee", border: "rgba(6,182,212,0.3)" },
};

const DEFAULT_COLOR = { bg: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "rgba(124,58,237,0.3)" };

export default function SlideCard({ slide, onDelete }) {
  const { data: session } = useSession();
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const colors = CATEGORY_COLORS[slide.category] || DEFAULT_COLOR;

  const isOwner = session?.user?.email === slide.uploadedBy;

  async function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Delete "${slide.title}"? This cannot be undone.`)) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/slides/${slide._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        onDelete?.(slide._id);
      } else {
        alert("Failed to delete slide");
        setDeleting(false);
      }
    } catch (err) {
      alert("Something went wrong");
      setDeleting(false);
    }
  }


  return (
    <div style={{
      background: "#13102a",
      border: "0.5px solid rgba(255,255,255,0.08)",
      borderRadius: "12px",
      overflow: "hidden",
      transition: "border-color 0.2s, transform 0.2s",
      cursor: "pointer",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(124,58,237,0.45)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Preview Image */}
      <div style={{ position: "relative" }}>
        <img
          src={slide.previewImageUrl}
          alt={slide.title}
          style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }}
        />
        {/* Dark overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(19,16,42,0.8), transparent)",
        }} />
        {/* Category Badge */}
        <span style={{
          position: "absolute", top: "10px", left: "10px",
          background: colors.bg,
          color: colors.color,
          border: `0.5px solid ${colors.border}`,
          fontSize: "11px", fontWeight: "500",
          padding: "3px 10px", borderRadius: "20px",
        }}>
          {slide.category}
        </span>
      </div>

      {/* Card Body */}
      <div style={{ padding: "14px" }}>
        <h3 style={{
          color: "#fff", fontSize: "14px",
          fontWeight: "500", lineHeight: "1.4",
          marginBottom: "6px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {slide.title}
        </h3>

                  <p style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: "12px", lineHeight: "1.5",
            marginBottom: "6px",
            display: expanded ? "block" : "-webkit-box",
            WebkitLineClamp: expanded ? "unset" : 2,
            WebkitBoxOrient: "vertical",
            overflow: expanded ? "visible" : "hidden",
          }}>
            {slide.description}
          </p>

          {slide.description.length > 100 && (
            <button
              onClick={(e) => { e.preventDefault(); setExpanded(!expanded); }}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: colors.color, fontSize: "11px", fontWeight: "500",
                padding: 0, marginBottom: "12px", display: "block",
              }}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "12px" }}>
          {slide.tags.slice(0, 3).map((tag, i) => (
            <span key={i} style={{
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.35)",
              fontSize: "10px",
              padding: "2px 8px",
              borderRadius: "20px",
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "12px",
        }}>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px" }}>
            {slide.competitionName}
          </span>
          <span style={{ color: colors.color, fontSize: "11px", fontWeight: "500" }}>
            {slide.year}
          </span>
        </div>

        {/* View Button */}
        <a
          href={slide.slideFileUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block", textAlign: "center",
            background: "rgba(124,58,237,0.15)",
            border: "0.5px solid rgba(124,58,237,0.3)",
            color: "#a78bfa",
            fontSize: "12px", fontWeight: "500",
            padding: "8px", borderRadius: "8px",
            textDecoration: "none",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.3)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(124,58,237,0.15)"}
        >
          View Slides →
        </a>


        {/* Edit Button - only visible to the slide's owner */}
        {isOwner && (
          <Link
            href={`/edit/${slide._id}`}
            style={{
              display: "block", width: "100%", textAlign: "center",
              background: "rgba(96,165,250,0.1)",
              border: "0.5px solid rgba(96,165,250,0.3)",
              color: "#60a5fa",
              fontSize: "12px", fontWeight: "500",
              padding: "8px", borderRadius: "8px",
              marginTop: "8px", textDecoration: "none",
            }}
          >
            Edit Slide
          </Link>
        )}

        {/* Delete Button - only visible to the slide's owner */}
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              display: "block", width: "100%", textAlign: "center",
              background: "rgba(239,68,68,0.1)",
              border: "0.5px solid rgba(239,68,68,0.3)",
              color: "#f87171",
              fontSize: "12px", fontWeight: "500",
              padding: "8px", borderRadius: "8px",
              marginTop: "8px", cursor: deleting ? "not-allowed" : "pointer",
              opacity: deleting ? 0.5 : 1,
            }}
          >
            {deleting ? "Deleting..." : "Delete Slide"}
          </button>
        )}
      </div>
    </div>
  );
}