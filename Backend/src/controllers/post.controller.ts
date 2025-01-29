import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { CreatePostZodSchema } from "../zod_schema/post.schema";
import { Post } from "../models/post.model";
import { DEFAULT_POST_IMAGE } from "../constants";

const createPost = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    if (req.user?.isAdmin === false) {
      return res.status(403).json({
        message: "You are not allowed to create a post",
      });
    }

    if (req.file) {
      const localPath = req.file.path;

      try {
        const postImageUrl = await uploadOnCloudinary(localPath);

        req.body.imageUrl = postImageUrl.secure_url || DEFAULT_POST_IMAGE;
      } catch (error) {
        console.error("Error while uploading image to Cloudinary:", error);
      }
    }

    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    const newPost = new Post({
      title: req.body.title,
      category: req.body.category,
      content: req.body.content,
      imageUrl: req.body.imageUrl,
      slug,
      userId: req.user?._id,
    });

    const parseRequestBody = CreatePostZodSchema.safeParse(req.body);

    if (!parseRequestBody.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parseRequestBody.error.errors.map((item) => item.message),
      });
    }

    try {
      const savedPost = await newPost.save();
      return res.status(200).json(
        new ApiResponse(200, "Post created", {
          post: savedPost,
        })
      );
    } catch (error) {
      console.error("Error while saving post:", error);
      return res.status(500).json({
        message: "Error while saving post to database",
      });
    }
  }
);

export { createPost };
