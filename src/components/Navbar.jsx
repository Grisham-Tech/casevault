"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav style={{
      background: "#0f0a1e",
      borderBottom: "0.5px solid rgba(255,255,255,0.08)",
      padding: "14px 24px",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: "22px", fontWeight: "600", color: "#fff" }}>
            Case<span style={{ color: "#a78bfa" }}>Vault</span>
          </span>
        </Link>

        {/* Category Links */}
        <div style={{ display: "flex", gap: "24px" }}>
          {["Strategy", "Finance", "Marketing", "Social Impact"].map((cat) => (
            <Link
              key={cat}
              href={`/?category=${cat}`}
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "13px",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.target.style.color = "#fff"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

          {session ? (
            <>
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}>
                {session.user.email}
              </span>
              <Link href="/upload" style={{
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: "500",
                padding: "8px 18px",
                borderRadius: "8px",
                textDecoration: "none",
              }}>
                ↑ Upload
              </Link>
              <button
                onClick={() => signOut()}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "13px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/login" style={{
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: "500",
              padding: "8px 18px",
              borderRadius: "8px",
              textDecoration: "none",
            }}>
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}