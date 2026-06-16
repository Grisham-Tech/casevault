import { NextResponse } from "next/server";

// In-memory array acting as your database collection
let mockSlides = [];

// GET /api/slides - Instantly return the slides structure
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 9;
    
    const total = mockSlides.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedSlides = mockSlides.slice(startIndex, endIndex);

    return NextResponse.json({
      slides: paginatedSlides,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 });
  }
}

// POST /api/slides - Instantly create a slide without database round-trips
export async function POST(request) {
  try {
    const data = await request.json();
    
    const newSlide = {
      _id: `mock_${Date.now()}`,
      title: data.title || "Untitled Slide",
      imageUrl: data.imageUrl || "https://via.placeholder.com/150",
      description: data.description || "",
      order: data.order || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockSlides.push(newSlide);
    return NextResponse.json(newSlide, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create slide" }, { status: 500 });
  }
}