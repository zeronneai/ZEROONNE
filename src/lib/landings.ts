import fm from 'front-matter';

const modules = import.meta.glob('/src/content/landings/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export interface ServiceItem { title: string; description: string }
export interface FaqItem     { q: string; a: string }

export interface Landing {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  datePublished: string;
  heroTitle: string;
  heroSubtitle: string;
  targetKeyword: string;
  problemIntro: string;
  problemBullets: string[];
  services: ServiceItem[];
  whyElPaso: string;
  whyElPasoPoints: string[];
  relatedCaseStudies: string[];   // array of case study slugs
  faq: FaqItem[];
  content: string;
}

export function getAllLandings(): Landing[] {
  return Object.entries(modules).map(([path, raw]) => {
    const parsed = fm(raw);
    const data = parsed.attributes as any;
    const slug = path.split('/').pop()?.replace('.md', '') || '';

    return {
      slug,
      title:              data.title              || '',
      metaTitle:          data.metaTitle          || data.title || '',
      metaDescription:    data.metaDescription    || '',
      datePublished:      data.datePublished       || new Date().toISOString(),
      heroTitle:          data.heroTitle           || '',
      heroSubtitle:       data.heroSubtitle        || '',
      targetKeyword:      data.targetKeyword       || '',
      problemIntro:       data.problemIntro        || '',
      problemBullets:     data.problemBullets      || [],
      services:           data.services            || [],
      whyElPaso:          data.whyElPaso           || '',
      whyElPasoPoints:    data.whyElPasoPoints     || [],
      relatedCaseStudies: data.relatedCaseStudies  || [],
      faq:                data.faq                 || [],
      content:            parsed.body,
    };
  });
}

export function getLandingBySlug(slug: string): Landing | null {
  return getAllLandings().find(l => l.slug === slug) || null;
}
