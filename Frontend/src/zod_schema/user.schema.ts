import { z } from "zod";

const RegisterUserZodSchema = z.object({
  username: z
    .string()
    .nonempty({ message: "Username is required" })
    .trim()
    .toLowerCase(),
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid email address" }),
  profilePicture: z.string().optional(),
  password: z
    .string({ message: "Password is required" })
    .nonempty({ message: "Password is required" }),
});

const SigninUserZodSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string().nonempty({ message: "Password is required" }),
});

type TypeRegisterUserZodSchema = z.infer<typeof RegisterUserZodSchema>;
type TypeSigninUserZodSchema = z.infer<typeof SigninUserZodSchema>;
export {
  type TypeRegisterUserZodSchema,
  type TypeSigninUserZodSchema,
  RegisterUserZodSchema,
  SigninUserZodSchema,
};
