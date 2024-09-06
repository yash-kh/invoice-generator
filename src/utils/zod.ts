import { z } from "zod";

const productSchema = z.object({
  name: z.string(),
  qty: z.number().positive(),
  rate: z.number().positive(),
});

export const addProductsSchema = z.object({
  products: z.array(productSchema),
});
