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
// const imageFileSchema = z
//   .instanceof(File)
//   .optional()
//   .refine((file) => file.type.startsWith("image/"), {
//     message: "The file must be an image.",
//   })
//   .refine((file) => {
//     return !file || file.size <= MAX_UPLOAD_SIZE;
//   }, "File size must be less than 3MB");
// const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = ["image/png"];

const imageFileSchema = z
  .instanceof(File)
  .optional()
  .refine((file) => {
    return !file || file.size <= MAX_UPLOAD_SIZE;
  }, "File size must be less than 3MB")
  .refine((file) => {
    return ACCEPTED_FILE_TYPES.includes(file!.type);
  }, "File must be a PNG");
const UpdateUserZodSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .nonempty({ message: "Username is required" }),
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid email address" }),

  profilePictureFile: z
    .instanceof(FileList)
    .optional()
    .refine(
      (fileList) => {
        if (!fileList || fileList.length === 0) return true;

        return fileList[0]?.size <= 5 * 1024 * 1024;
      },
      {
        message: "File size must be less than 5MB",
      }
    )
    .refine(
      (fileList) => {
        if (!fileList || fileList.length === 0) return true;

        return ["image/jpeg", "image/png"].includes(fileList[0]?.type);
      },
      {
        message: "Only JPG and PNG images are allowed",
      }
    ),

  password: z.string().nonempty({ message: "Password is required" }),
});

type TypeRegisterUserZodSchema = z.infer<typeof RegisterUserZodSchema>;
type TypeSigninUserZodSchema = z.infer<typeof SigninUserZodSchema>;
type TypeUpdateUserZodSchema = z.infer<typeof UpdateUserZodSchema>;
export {
  type TypeRegisterUserZodSchema,
  type TypeSigninUserZodSchema,
  type TypeUpdateUserZodSchema,
  RegisterUserZodSchema,
  SigninUserZodSchema,
  UpdateUserZodSchema,
};
