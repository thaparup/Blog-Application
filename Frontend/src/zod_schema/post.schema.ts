import { z } from "zod";

const CreatePostZodSchema = z.object({
  title: z.string().nonempty({ message: "Title is required" }), // Custom error message for title
  category: z
    .string()
    .nonempty({ message: "Category is required" })
    .refine((value) => value !== "uncategorized", {
      message: "Category is empty'",
    }),
  content: z
    .string()
    .refine((value) => value.trim().length > 0, {
      message: "Content cannot be empty",
    })
    .refine((value) => value.length >= 5, {
      message: "Content cannot be less than 50 characters",
    }),
  postImageFile: z
    .instanceof(FileList)
    .refine((value) => value && value.length > 0, {
      message: "Please select one image",
    })
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
});
const UpdatePostZodSchema = z.object({
  title: z.string().nonempty({ message: "Title is required" }), // Custom error message for title
  category: z
    .string()
    .nonempty({ message: "Category is required" })
    .refine((value) => value !== "uncategorized", {
      message: "Category is empty'",
    }),
  content: z
    .string()
    .refine((value) => value.trim().length > 0, {
      message: "Content cannot be empty",
    })
    .refine((value) => value.length >= 5, {
      message: "Content cannot be less than 50 characters",
    }),
  postImageFile: z
    .instanceof(FileList)
    .refine((value) => value && value.length > 0, {
      message: "Please select one image",
    })
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
});
type TypeUpdatePostZodSchema = z.infer<typeof UpdatePostZodSchema>;
type TypeCreatePostZodSchema = z.infer<typeof CreatePostZodSchema>;

export {
  type TypeCreatePostZodSchema,
  type TypeUpdatePostZodSchema,
  CreatePostZodSchema,
  UpdatePostZodSchema,
};
