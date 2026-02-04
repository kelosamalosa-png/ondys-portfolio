import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    projectSlug: z.string(),
    status: z.enum(['beta', 'prototype', 'live']),
    category: z.enum(['app', 'tool', 'web', 'game']),
    featured: z.boolean().default(false),
    year: z.number(),
    title_cs: z.string(),
    title_en: z.string(),
    summary_cs: z.string(),
    summary_en: z.string(),
    stack: z.array(z.string()).default([]),
    links_website: z.string().optional(),
    links_demo: z.string().optional(),
    links_github: z.string().optional(),
    links_other: z.string().optional(),
    images: z.array(z.string()).default([]),
  }),
});

export const collections = {
  projects: projectsCollection,
};
