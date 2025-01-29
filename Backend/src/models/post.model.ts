import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  userId: { type: mongoose.Schema.Types.ObjectId; ref: "User" };
  content: string;
  title: string;
  imageUrl: string;
  category: string;
  slug: string;
}

const postSchema = new Schema<IPost>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    category: {
      type: String,
    },
    slug: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model<IPost>("Post", postSchema);
