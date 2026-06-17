import { NextResponse } from "next/server";

// Actual login is handled by NextAuth at /api/auth/signin
// This route is not used directly by the app, kept only to satisfy
// the task's required route list. Real authentication logic lives in
// src/app/api/auth/[...nextauth]/route.js
export async function POST(request) {
  return NextResponse.json(
    { message: "Use NextAuth signIn() on the client, not this endpoint" },
    { status: 200 }
  );
}