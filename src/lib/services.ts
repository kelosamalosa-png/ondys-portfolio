import { getCollection, type CollectionEntry } from 'astro:content';

export type ServiceEntry = CollectionEntry<'services'>;
export type ServiceData = ServiceEntry['data'];

export async function getServices(): Promise<ServiceEntry[]> {
  const services = await getCollection('services');
  return services.sort((a, b) => a.data.order - b.data.order);
}

export async function getFeaturedServices(): Promise<ServiceEntry[]> {
  const services = await getCollection('services');
  return services
    .filter((s) => s.data.featured)
    .sort((a, b) => a.data.order - b.data.order);
}

export async function getServiceBySlug(slug: string, lang: 'cs' | 'en'): Promise<ServiceEntry | undefined> {
  const services = await getCollection('services');
  const slugField = lang === 'cs' ? 'slug_cs' : 'slug_en';
  return services.find((s) => s.data[slugField] === slug);
}

export async function getServiceByServiceSlug(serviceSlug: string): Promise<ServiceEntry | undefined> {
  const services = await getCollection('services');
  return services.find((s) => s.data.serviceSlug === serviceSlug);
}
