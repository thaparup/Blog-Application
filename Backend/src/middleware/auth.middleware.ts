import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser, User } from "../models/user.model";
import { ApiError } from "../utils/Apierror";

declare module "express" {
  interface Request {
    user?: IUser | null;
  }
}
const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken: string | JwtPayload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || ""
    );

    if (!decodedToken || typeof decodedToken === "string") {
      throw new ApiError(401, "Invalid Access Token");
    }

    const user = await User.findById(decodedToken?._id).select("-password");

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      401,
      (error as { message: string }).message || "Invalid access token"
    );
  }
};

export { verifyJwt };
