import { z } from "zod";

const RegisterUserZodSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .nonempty({ message: "Username is required" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .nonempty({ message: "Email is required" }),

  profilePicture: z.string().optional(),
  password: z
    .string({ message: "Password is required" })
    .nonempty({ message: "Password is required" }),
});

type TypeRegisterUserZodSchema = z.infer<typeof RegisterUserZodSchema>;
export { type TypeRegisterUserZodSchema, RegisterUserZodSchema };
