import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Slide from "@/models/Slide";

// GET /api/slides/[id] - Fetch a single slide by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const slide = await Slide.findById(params.id);

    if (!slide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    return NextResponse.json(slide);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch slide" },
      { status: 500 }
    );
  }
}

// PUT /api/slides/[id] - Update a slide (Protected Route)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    const updatedSlide = await Slide.findByIdAndUpdate(params.id, data, {
      new: true, // Returns the modified document rather than the original
      runValidators: true,
    });

    if (!updatedSlide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    return NextResponse.json(updatedSlide);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update slide" },
      { status: 500 }
    );
  }
}

// DELETE /api/slides/[id] - Delete a slide (Protected Route)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const deletedSlide = await Slide.findByIdAndDelete(params.id);

    if (!deletedSlide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Slide deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete slide" },
      { status: 500 }
    );
  }
}
