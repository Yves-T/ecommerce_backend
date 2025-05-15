import { z } from "zod";

// sign up
export const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type TSignUpSchema = z.infer<typeof signUpSchema>;

// login

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type TLoginSchema = z.infer<typeof loginSchema>;

// new product
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const newProductSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  price: z.coerce
    .number()
    .positive({ message: "Please enter a valid positive number" }),
  images: z.any().optional(),
  category: z.string().optional(),
  // properties: z.array(propertySchema).optional(),
  productProperties: z.any().optional(),
});

export type TNewProductSchema = z.infer<typeof newProductSchema>;

// upload
export const uploadSchema = z.object({
  images: z.array(z.instanceof(File)).superRefine((files, ctx) => {
    const isExceedingMaxFileSize = files.some((file) => {
      return file.size >= MAX_FILE_SIZE;
    });
    if (isExceedingMaxFileSize) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: MAX_FILE_SIZE,
        message: "Max image size is 5MB",
        type: "string",
        inclusive: true,
      });
    }

    const isAcceptedTypes = files.every((file) => {
      return ACCEPTED_IMAGE_TYPES.includes(file?.type);
    });

    if (!isAcceptedTypes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
      });
    }
  }),
});

export type TUploadSchema = z.infer<typeof uploadSchema>;

const propertySchema = z.object({
  name: z.string().min(2, "Name must contain at least 2 characters"),
  values: z.string().min(2, "Values must contain at least 2 characters"),
});

export const categorySchema = z.object({
  name: z.string().min(3),
  parent: z.string().optional(),
  properties: z.array(propertySchema).optional(),
});

export type TCategorySchema = z.infer<typeof categorySchema>;
