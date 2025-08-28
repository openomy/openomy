import { z } from 'zod';

export const ProductImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const ProductLinksSchema = z
  .object({
    website: z.string().url().optional(),
    github: z.string().url().optional(),
  })
  .catchall(z.string().optional());

export const ProductContributorSchema = z.object({
  githubUsername: z.string().min(1),
  addedDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
});

export const ProductSchema = z.object({
  id: z.string().min(1),
  productName: z.string().min(1),
  label: z.string().optional(),
  description: z.string().min(1),
  image: ProductImageSchema,
  category: z.string().min(1),
  links: ProductLinksSchema.optional(),
  tags: z.array(z.string()).max(10).optional(),
  contributor: ProductContributorSchema.optional(),
});

export const ProductsDataSchema = z.object({
  products: z.array(ProductSchema),
});

export type ProductsDataDoc = z.infer<typeof ProductsDataSchema>;
export type ProductDoc = z.infer<typeof ProductSchema>;

