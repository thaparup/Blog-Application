import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { IUser, User } from "../models/user.model";
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

const googleSignin = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || "1d";
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { email, name, googlePhotoUrl } = req.body;
    try {
      const user = (await User.findOne({ email })) as IUser;
      if (user) {
        const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.ACCESS_TOKEN_SECRET!,
          {
            expiresIn: accessTokenExpiry,
          }
        );
        const userObj = user?.toObject();
        const { password, ...rest } = userObj;

        res
          .status(201)
          .cookie("accessToken", token, options)
          .json(
            new ApiResponse(200, "User logged in successfully", {
              user: rest,
              at: token,
            })
          );
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        console.log("generated password", generatedPassword);
        const newUser = new User({
          username:
            name.toLowerCase().split(" ").join("") +
            Math.random().toString(9).slice(-4),
          email,
          password: generatedPassword,
          profilePicture: googlePhotoUrl,
        });
        const savedUser = await newUser.save();
        if (savedUser) {
          const checkingSavedUser = await User.findById(savedUser._id).select(
            "-password"
          );
          const token = jwt.sign(
            { id: savedUser._id, isAdmin: newUser.isAdmin },
            process.env.ACCESS_TOKEN_SECRET!,
            {
              expiresIn: accessTokenExpiry,
            }
          );
          res
            .status(201)
            .cookie("accessToken", token, options)
            .json(
              new ApiResponse(200, "User logged in successfully", {
                user: checkingSavedUser,
                at: token,
              })
            );
        }
      }
    } catch (error) {
      throw new ApiError(409, "error while signing up with google");
    }
  }
);

export { signIn, googleSignin };
