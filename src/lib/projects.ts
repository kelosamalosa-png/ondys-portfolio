import { z } from 'zod';
import projectsData from '../data/projects.json';

const LocalizedStringSchema = z.object({
  cs: z.string(),
  en: z.string(),
});

const LinksSchema = z.object({
  website: z.string(),
  demo: z.string(),
  github: z.string(),
  other: z.string(),
});

const LocalizedDetailsSchema = z.object({
  problem: z.string(),
  solution: z.string(),
  features: z.array(z.string()),
  notes: z.string().optional().default(''),
});

const DetailsSchema = z.object({
  cs: LocalizedDetailsSchema,
  en: LocalizedDetailsSchema,
});

const ProjectSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  status: z.enum(['live', 'beta', 'prototype', 'archived']),
  category: z.enum(['app', 'tool', 'game', 'other']),
  featured: z.boolean(),
  year: z.number().optional(),
  title: LocalizedStringSchema,
  summary: LocalizedStringSchema,
  stack: z.array(z.string()),
  links: LinksSchema,
  details: DetailsSchema,
  images: z.array(z.string()),
});

const ProjectsArraySchema = z.array(ProjectSchema);

export type Project = z.infer<typeof ProjectSchema>;
export type Lang = 'cs' | 'en';

let cachedProjects: Project[] | null = null;

function validateProjects(): Project[] {
  if (cachedProjects) {
    return cachedProjects;
  }

  const result = ProjectsArraySchema.safeParse(projectsData);

  if (!result.success) {
    const errorMessage = result.error.issues
      .map((issue) => {
        const path = issue.path.join(' -> ');
        return `  - ${path}: ${issue.message}`;
      })
      .join('\n');

    throw new Error(
      `\n\n❌ PROJECTS.JSON VALIDATION FAILED!\n\nThe following issues were found in src/data/projects.json:\n\n${errorMessage}\n\nPlease fix these issues and try again.\n`
    );
  }

  cachedProjects = result.data;
  return cachedProjects;
}

export function getProjects(): Project[] {
  return validateProjects();
}

export function getProject(slug: string): Project | undefined {
  const projects = validateProjects();
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(limit?: number): Project[] {
  const projects = validateProjects();
  const featured = projects.filter((p) => p.featured);
  return limit ? featured.slice(0, limit) : featured;
}

export function getProjectsByCategory(category: Project['category']): Project[] {
  const projects = validateProjects();
  return projects.filter((p) => p.category === category);
}

export function getLocalizedTitle(project: Project, lang: Lang): string {
  return project.title[lang];
}

export function getLocalizedSummary(project: Project, lang: Lang): string {
  return project.summary[lang];
}

export function getLocalizedDetails(project: Project, lang: Lang) {
  return project.details[lang];
}

export function getStatusLabel(status: Project['status'], lang: Lang): string {
  const labels: Record<Project['status'], { cs: string; en: string }> = {
    live: { cs: 'Živě', en: 'Live' },
    beta: { cs: 'Beta', en: 'Beta' },
    prototype: { cs: 'Prototyp', en: 'Prototype' },
    archived: { cs: 'Archivováno', en: 'Archived' },
  };
  return labels[status][lang];
}

export function getCategoryLabel(category: Project['category'], lang: Lang): string {
  const labels: Record<Project['category'], { cs: string; en: string }> = {
    app: { cs: 'Aplikace', en: 'App' },
    tool: { cs: 'Nástroj', en: 'Tool' },
    game: { cs: 'Hra', en: 'Game' },
    other: { cs: 'Ostatní', en: 'Other' },
  };
  return labels[category][lang];
}
