import { z } from "zod";

export const CreateProductFormModelSchema: any = z.object({
    id: z.number().optional(),
    title: z.string().min(1, "title is required"),
    description: z.string().min(1, "Description is required"),
    price: z.string().min(1, "Price is required"),
    authors: z.array(z.string()).min(1, "Authors are required"),
    tags: z.array(z.string()).min(1, "Tags are required"),
    thumbnailUrl: z.string().nullable(),
    imagesUrl: z.array(z.string()).nullable(),
});

export const ProductFormModelSchema: any = CreateProductFormModelSchema.extend({
    id: z.number().positive(),
});
