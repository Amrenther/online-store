import { z } from "zod";

export const productQuerySchema = z.object({
    cursor: z.coerce.number().optional(),
    limit: z.coerce.number().min(1).max(50).default(12),
    categorySlug: z.string().optional(),
})

export type ProductQuery = z.infer<typeof productQuerySchema>;