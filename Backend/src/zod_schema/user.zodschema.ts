import { z } from "zod";

const registerUserZodSchema = z.object({
  username: z
    .string({ required_error: "username is required" })
    .trim()
    .toLowerCase(),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  profilePicture: z.string().optional(),
  password: z.string({ required_error: "Password is required" }),
});

export { registerUserZodSchema };
