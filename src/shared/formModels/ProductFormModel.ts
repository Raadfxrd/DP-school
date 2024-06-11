import { z } from "zod";

export const CreateProductFormModelSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.number().min(0),
    thumbnail: z.string().url(),
    url: z.string().url(),
    type: z.enum(["game", "merch"]),
    tags: z.array(z.string().min(1)),
    authors: z.array(z.string().min(1)),
    images: z.array(z.string().url()),
});

export const ProductFormModelSchema = CreateProductFormModelSchema.extend({
    id: z.number(),
});
