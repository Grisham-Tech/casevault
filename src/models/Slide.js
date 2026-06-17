import mongoose from "mongoose";

const SlideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
    },
    competitionName: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    previewImageUrl: {
      type: String,
      required: true,
    },
    slideFileUrl: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Slide = mongoose.models.Slide || mongoose.model("Slide", SlideSchema);

export default Slide;