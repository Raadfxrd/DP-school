import { z } from "zod";

export const CreateProductFormModelSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.string().min(1, "Price is required"),
    authors: z.array(z.string()).min(1, "Authors are required"),
    tags: z.array(z.string()).min(1, "Tags are required"),
    thumbnailUrl: z.string().nullable(),
    imagesUrl: z.array(z.string()).nullable(),
});


export const ProductFormModelSchema = CreateProductFormModelSchema.extend({
    id: z.number().positive(),
});
