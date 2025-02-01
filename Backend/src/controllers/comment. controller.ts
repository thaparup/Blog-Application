import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Comment } from "../models/comment.model";
import { ApiError } from "../utils/Apierror";
import { ApiResponse } from "../utils/ApiResponse";
import { SortOrder } from "mongoose";

const createComment = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { content, postId, userId } = req.body;
    if (userId !== req.user?.id) {
      throw new ApiError(401, "You are not allowed to create this comment");
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();

    res
      .status(201)
      .json(new ApiResponse(201, "Comment created", { comment: newComment }));
  }
);

const getPostComments = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });

    res
      .status(200)
      .json(new ApiResponse(200, "Comments retrieved", { comments: comments }));
  }
);

const likeDislikeComment = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }
    const userIndex = comment.likes.indexOf(req.user?.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user?.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res
      .status(200)
      .json(new ApiResponse(200, "Comment liked", { comment: comment }));
  }
);

const getComments = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    if (req.user?.isAdmin === false)
      throw new ApiError(403, "You are not allowed to get all comments");

    const startIndex = parseInt(req.query.startIndex as string) || 0;
    const limit = parseInt(req.query.limit as string) || 9;
    const sortDirection: SortOrder = req.query.order === "asc" ? 1 : -1;

    const comments = await Comment.find()
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comment.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return res.status(200).json(
      new ApiResponse(200, "Posts", {
        comments,
        totalComments,
        lastMonthComments,
      })
    );
  }
);

export { createComment, getPostComments, likeDislikeComment, getComments };
