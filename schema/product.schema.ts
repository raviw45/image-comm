import { z } from "zod";
export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  image: z.union([z.string().url(), z.instanceof(File)]).optional(),
  variants: z
    .array(
      z.object({
        type: z.enum(["SQUARE", "WIDE", "PORTRAIT"]),
        price: z.number().min(0, "Price must be non-negative"),
        license: z.enum(["personal", "commercial"]),
      })
    )
    .min(1, "At least one variant is required"),
});
