import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { CreatePostZodSchema } from "../zod_schema/post.schema";
import { Post } from "../models/post.model";
import { DEFAULT_POST_IMAGE } from "../constants";
import { SortOrder } from "mongoose";
import { ApiError } from "../utils/Apierror";

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

const getPosts = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const startIndex = parseInt(req.query.startIndex as string) || 0;
    const limit = parseInt(req.query.limit as string) || 9;
    const sortDirection: SortOrder = req.query.order === "asc" ? 1 : -1;

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { category: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    console.log(posts);
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return res.status(200).json(
      new ApiResponse(200, "Posts", {
        posts,
        totalPosts,
        lastMonthPosts,
      })
    );
  }
);

const deletePost = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    if (req.user?.isAdmin === false || req.user?.id !== req.params.userId) {
      throw new Error("You are not allowed to delete this post");
    }

    try {
      await Post.findByIdAndDelete(req.params.postId);
      res.status(200).json("The post has been deleted");
    } catch (error) {
      new ApiError(500, "Post could not be deleted");
    }
  }
);
export { createPost, getPosts, deletePost };
