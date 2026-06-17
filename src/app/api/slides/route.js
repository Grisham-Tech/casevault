import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Slide from "@/models/Slide";
import cloudinary from "@/lib/cloudinary";

// GET /api/slides — public, supports search, filter, sort, pagination
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 9;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "newest";

    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    let sortObj = {};
    if (sort === "newest") sortObj = { createdAt: -1 };
    if (sort === "oldest") sortObj = { createdAt: 1 };
    if (sort === "title") sortObj = { title: 1 };

    const skip = (page - 1) * limit;

    const [slides, total] = await Promise.all([
      Slide.find(filter).sort(sortObj).skip(skip).limit(limit),
      Slide.countDocuments(filter),
    ]);

    return NextResponse.json({
      slides,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET SLIDES ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch slides" },
      { status: 500 }
    );
  }
}

// POST /api/slides — protected, requires login
export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to upload" },
        { status: 401 }
      );
    }

    await connectDB();

    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const competitionName = formData.get("competitionName");
    const year = formData.get("year");
    const tagsRaw = formData.get("tags") || "";
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const previewImage = formData.get("previewImage");
    const slideFile = formData.get("slideFile");

    if (!previewImage || !slideFile) {
      return NextResponse.json(
        { error: "Both preview image and slide file are required" },
        { status: 400 }
      );
    }

    // Upload preview image to cloudinary
    let imageUpload;
    try {
      const imageBuffer = await previewImage.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString("base64");
      const imageDataUri = `data:${previewImage.type};base64,${imageBase64}`;

      imageUpload = await cloudinary.uploader.upload(imageDataUri, {
        folder: "casevault/images",
        resource_type: "image",
      });
    } catch (imgError) {
      console.error("CLOUDINARY IMAGE UPLOAD ERROR:", imgError);
      return NextResponse.json(
        { error: `Image upload failed: ${imgError.message}` },
        { status: 500 }
      );
    }

    // Upload slide PDF/PPTX to cloudinary
    let slideUpload;
    try {
      const slideBuffer = await slideFile.arrayBuffer();
      const slideBase64 = Buffer.from(slideBuffer).toString("base64");
      const slideDataUri = `data:${slideFile.type};base64,${slideBase64}`;

      slideUpload = await cloudinary.uploader.upload(slideDataUri, {
        folder: "casevault/slides",
        resource_type: "auto",
        type: "upload",
        access_mode: "public",
      });
    } catch (slideError) {
      console.error("CLOUDINARY SLIDE UPLOAD ERROR:", slideError);
      return NextResponse.json(
        { error: `Slide file upload failed: ${slideError.message}` },
        { status: 500 }
      );
    }

    // Save to database
    const slide = await Slide.create({
      title,
      description,
      category,
      competitionName,
      year: parseInt(year),
      tags,
      previewImageUrl: imageUpload.secure_url,
      slideFileUrl: slideUpload.secure_url,
      uploadedBy: session.user.email,
    });

    return NextResponse.json(
      { message: "Slide uploaded successfully", slide },
      { status: 201 }
    );
  } catch (error) {
    console.error("SLIDE UPLOAD ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload slide" },
      { status: 500 }
    );
  }
}