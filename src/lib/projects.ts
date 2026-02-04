import { getCollection, type CollectionEntry } from 'astro:content';

export type ProjectEntry = CollectionEntry<'projects'>;
export type ProjectData = ProjectEntry['data'];
export type Lang = 'cs' | 'en';

export async function getProjects(): Promise<ProjectEntry[]> {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => {
    if (b.data.year !== a.data.year) {
      return b.data.year - a.data.year;
    }
    return a.data.title_en.localeCompare(b.data.title_en);
  });
}

export async function getProject(slug: string): Promise<ProjectEntry | undefined> {
  const projects = await getCollection('projects');
  return projects.find((p) => p.data.projectSlug === slug);
}

export async function getFeaturedProjects(limit?: number): Promise<ProjectEntry[]> {
  const projects = await getCollection('projects');
  const featured = projects
    .filter((p) => p.data.featured)
    .sort((a, b) => {
      if (b.data.year !== a.data.year) {
        return b.data.year - a.data.year;
      }
      return a.data.title_en.localeCompare(b.data.title_en);
    });
  return limit ? featured.slice(0, limit) : featured;
}

export async function getProjectsByCategory(category: ProjectData['category']): Promise<ProjectEntry[]> {
  const projects = await getCollection('projects');
  return projects.filter((p) => p.data.category === category);
}

export function getLocalizedTitle(project: ProjectEntry, lang: Lang): string {
  return lang === 'cs' ? project.data.title_cs : project.data.title_en;
}

export function getLocalizedSummary(project: ProjectEntry, lang: Lang): string {
  return lang === 'cs' ? project.data.summary_cs : project.data.summary_en;
}

export function getStatusLabel(status: ProjectData['status'], lang: Lang): string {
  const labels: Record<ProjectData['status'], { cs: string; en: string }> = {
    live: { cs: 'Živě', en: 'Live' },
    beta: { cs: 'Beta', en: 'Beta' },
    prototype: { cs: 'Prototyp', en: 'Prototype' },
  };
  return labels[status][lang];
}

export function getCategoryLabel(category: ProjectData['category'], lang: Lang): string {
  const labels: Record<ProjectData['category'], { cs: string; en: string }> = {
    app: { cs: 'Aplikace', en: 'App' },
    tool: { cs: 'Nástroj', en: 'Tool' },
    web: { cs: 'Web', en: 'Web' },
    game: { cs: 'Hra', en: 'Game' },
  };
  return labels[category][lang];
}
