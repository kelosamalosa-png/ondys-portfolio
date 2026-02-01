import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    status: z.enum(['live', 'beta', 'prototype']),
    category: z.enum(['apps', 'tools', 'games']),
    tags: z.array(z.string()),
    problem: z.string(),
    solution: z.string(),
    features: z.array(z.string()),
    links: z.array(z.object({
      label: z.string(),
      url: z.string(),
      type: z.enum(['primary', 'secondary']),
    })),
    screenshots: z.array(z.string()).optional(),
    order: z.number().default(0),
  }),
});

export const collections = {
  projects: projectsCollection,
};
