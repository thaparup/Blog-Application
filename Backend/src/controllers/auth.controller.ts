import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { ApiError } from "../utils/Apierror";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse";

const signIn = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    const existedUser = await User.findOne({
      email,
    });

    if (!existedUser) {
      throw new ApiError(404, "User doesn't exist");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existedUser.password
    );

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error("ACCESS_TOKEN_SECRET environment variable is not set");
    }
    const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || "1d";
    const accessToken = () => {
      return jwt.sign(
        {
          _id: existedUser._id,
          email: existedUser.email,
          username: existedUser.username,
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
          expiresIn: accessTokenExpiry,
        }
      );
    };
    const options = {
      httpOnly: true,
      secure: true,
    };

    const loginUser = {
      _id: existedUser._id,
      username: existedUser.username,
      email: existedUser.email,
      profilePicture: existedUser.profilePicture,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken(), options)
      .json(
        new ApiResponse(200, "User logged in successfully", {
          user: loginUser,
          at: accessToken(),
        })
      );
  }
);

export { signIn };
