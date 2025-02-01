import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { IUser, User } from "../models/user.model";
import { ApiError } from "../utils/Apierror";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { DEFAULT_PROFILE_IMAGE } from "../constants";
import bcrypt from "bcrypt";
import {
  RegisterUserZodSchema,
  UpdateUserZodSchema,
} from "../zod_schema/user.zodschema";
import { ApiResponse } from "../utils/ApiResponse";
import { SortOrder } from "mongoose";
const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { username, email, password } = req.body;
    req.body.profilePicture = DEFAULT_PROFILE_IMAGE;

    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existedUser) {
      throw new ApiError(409, "User with email or username already exists");
    }

    if (req.file) {
      const profileLocalPath = req.file.path;

      try {
        const profileImageUrl = await uploadOnCloudinary(profileLocalPath);

        req.body.profilePicture = profileImageUrl.secure_url;
      } catch (error) {
        throw new Error("Error while uploading image to Cloudinary");
      }
    }
    const parseRequestBody = RegisterUserZodSchema.safeParse(req.body);

    if (!parseRequestBody.success) {
      return res.status(400).json({
        message: "empty field",
        errors: parseRequestBody.error.errors.map((item) => item.message),
      });
    }

    try {
      const newUser = new User(parseRequestBody.data);
      const savedUser = await newUser.save();
      if (savedUser) {
        const checkingSavedUser = await User.findById(savedUser._id).select(
          "-password"
        );
        if (!checkingSavedUser) {
          new ApiError(500, "Internal Server Error");
        }
        return res
          .status(201)
          .json(
            new ApiResponse(
              201,
              "User registered successfully!",
              checkingSavedUser || {}
            )
          );
      } else {
        throw new ApiError(500, "Something went wrong ");
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
const updateUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    if (req.user?.id !== req.params.userId) {
      throw new Error("You are not allowed to update this user");
    }
    if (req.file) {
      const profileLocalPath = req.file.path;

      try {
        const profileImageUrl = await uploadOnCloudinary(profileLocalPath);

        req.body.profilePicture = profileImageUrl.secure_url;
      } catch (error) {
        throw new Error("Error while uploading image to Cloudinary");
      }
    }
    let hashedPassword = "";
    const parseRequestBody = UpdateUserZodSchema.safeParse(req.body);
    if (!parseRequestBody.success) {
      return res.status(400).json({
        message: "empty field",
        errors: parseRequestBody.error.errors.map((item) => item.message),
      });
    }
    try {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(req.body.password, salt);

      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            profilePicture: req.body.profilePicture,
            password: hashedPassword,
          },
        },
        { new: true }
      ).select("-password");

      res.status(200).json(
        new ApiResponse(200, "User profile udpated!", {
          user: updatedUser,
        })
      );
    } catch (error) {}
  }
);

const logoutUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .json(new ApiResponse(200, "User logged Out", {}));
  }
);

const deleteUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const options = {
      httpOnly: true,
      secure: true,
    };

    if (req.user?.isAdmin === false && req.user?.id !== req.params.userId) {
      throw new ApiError(403, "You are not allowed to delete this user");
    }
    try {
      await User.findByIdAndDelete(req.params.userId);
      res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
          new ApiResponse(200, "User has been deleted and logged out!", {})
        );
    } catch (error) {
      throw new ApiError(500, "Something went wrong ");
    }
  }
);

const getUsers = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    console.log(req.user);
    if (req.user?.isAdmin === false) {
      throw new ApiError(403, "You are not allowed to see all users");
    }
    const startIndex = parseInt(req.query.startIndex as string) || 0;
    const limit = parseInt(req.query.limit as string) || 9;
    const sortDirection: SortOrder = req.query.order === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .select("-password");

    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return res.status(200).json(
      new ApiResponse(200, "Totalusers", {
        users,
        totalUsers,
        lastMonthUsers,
      })
    );
  }
);

const getUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    res.status(200).json(
      new ApiResponse(200, "User found", {
        user,
      })
    );
  }
);

const tryUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { username } = req.body;

    console.log(req.file);
    res.send({ username: username });
  }
);
const demo = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  return res.status(200).json(new ApiResponse(200, "User logged Out", {}));
});

export {
  demo,
  registerUser,
  updateUser,
  tryUser,
  deleteUser,
  logoutUser,
  getUsers,
  getUser,
};
