import { translations, type Lang } from './translations';

export function getTranslations(lang: Lang) {
  return translations[lang];
}

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return 'cs';
}

export function getLocalizedPath(path: string, lang: Lang): string {
  return `/${lang}${path}`;
}
