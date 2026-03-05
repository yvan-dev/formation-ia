import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const courses = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    level: z.enum(['Débutant', 'Intermédiaire', 'Avancé']),
    image: z.string(),
    modules: z.array(
      z.object({
        title: z.string(),
        lessons: z.array(
          z.object({
            slug: z.string(),
            title: z.string(),
          }),
        ),
      }),
    ),
  }),
});

export const collections = { courses };
