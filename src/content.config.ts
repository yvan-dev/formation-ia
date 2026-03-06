import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const courses = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    level: z.string().optional(),
    image: z.string(),
    publicCible: z.string().optional(),
    prerequis: z.string().optional(),
    format: z.string().optional(),
    livrableFinal: z.string().optional(),
    objectifsGlobaux: z.array(z.string()).optional(),
    modules: z.array(
      z.object({
        title: z.string(),
        public: z.enum(['tous', 'profils techniques']).optional(),
        objectifs: z.array(z.string()).optional(),
        livrable: z.string().optional(),
        exercices: z.array(z.string()).optional(),
        released: z.boolean().optional(),
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
