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

const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    serviceSlug: z.string(),
    slug_cs: z.string(),
    slug_en: z.string(),
    icon: z.string(),
    order: z.number().default(0),
    featured: z.boolean().default(true),
    title_cs: z.string(),
    title_en: z.string(),
    description_cs: z.string(),
    description_en: z.string(),
    tags: z.array(z.string()).default([]),
    badge_cs: z.string().optional(),
    badge_en: z.string().optional(),
    price_cs: z.string().optional(),
    price_en: z.string().optional(),
    price_note_cs: z.string().optional(),
    price_note_en: z.string().optional(),
    related_project: z.string().optional(),
    seo_title_cs: z.string().optional(),
    seo_title_en: z.string().optional(),
    seo_description_cs: z.string().optional(),
    seo_description_en: z.string().optional(),
  }),
});

export const collections = {
  projects: projectsCollection,
  services: servicesCollection,
};
