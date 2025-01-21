import { z } from "zod";

const RegisterUserZodSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .nonempty({ message: "Username is required" }),
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid email address" }),

  profilePicture: z.string().optional(),
  password: z.string().nonempty({ message: "Password is required" }),
});

const SigninUserZodSchema = z.object({
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
