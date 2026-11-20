import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lore = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lore' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    category: z.enum(['history', 'demigods', 'factions', 'outer-gods', 'regions', 'items']),
    region: z.string().optional(),
    summary: z.string(),
    cloudinaryPublicId: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { lore };
