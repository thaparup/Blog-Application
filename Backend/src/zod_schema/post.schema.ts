import { z } from "zod";

const CreatePostZodSchema = z.object({
  title: z.string().nonempty({ message: "Title is required" }),
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
  imageUrl: z.string().nonempty("Image url is empty"),
});
const UpdatePostZodSchema = z.object({
  title: z.string().nonempty({ message: "Title is required" }),
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
  imageUrl: z.string().nonempty("Image url is empty"),
});

type TypeCreatePostZodSchema = z.infer<typeof CreatePostZodSchema>;
type TypeUpdatePostZodSchema = z.infer<typeof UpdatePostZodSchema>;

export {
  type TypeCreatePostZodSchema,
  type TypeUpdatePostZodSchema,
  CreatePostZodSchema,
  UpdatePostZodSchema,
};
