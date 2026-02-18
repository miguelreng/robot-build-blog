import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    author: z.string(),
    description: z.string(),
    quarter: z.string().optional().default("2026-Q1"),
    department: z.enum(["Service desk", "IT & Software", "Autonomy", "Data", "Hardware & Manufacturing", "Avanced Robotics", "Product Design", "Founders Office"]).optional(),
    coverImage: z.string().optional(),
    builderImage: z.string().optional(),
  }),
});

export const collections = { posts };
