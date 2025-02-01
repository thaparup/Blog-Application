import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  postId: { type: mongoose.Schema.Types.ObjectId; ref: "Post" };
  userId: { type: mongoose.Schema.Types.ObjectId; ref: "User" };
  likes: mongoose.Schema.Types.ObjectId[];
  numberOfLikes: number;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
