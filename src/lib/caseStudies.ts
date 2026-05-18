import fm from 'front-matter';

const modules = import.meta.glob('/src/content/case-studies/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  industry: string;
  services: string[];
  timeline: string;
  investment: string;
  featured: boolean;
  order?: number;
  coverImage?: string;
  metaTitle: string;
  metaDescription: string;
  datePublished: string;
  techStack: string[];
  keyResult: string;
  content: string;
}

export function getAllCaseStudies(): CaseStudy[] {
  const studies: CaseStudy[] = [];

  for (const path in modules) {
    const raw = modules[path];
    const parsed = fm(raw);
    const data = parsed.attributes as any;
    const content = parsed.body;
    const slug = path.split('/').pop()?.replace('.md', '') || '';

    studies.push({
      slug,
      title:            data.title            || 'Untitled',
      client:           data.client           || '',
      industry:         data.industry         || '',
      services:         data.services         || [],
      timeline:         data.timeline         || '',
      investment:       data.investment       || '',
      featured:         data.featured         || false,
      order:            data.order            !== undefined ? Number(data.order) : undefined,
      coverImage:       data.coverImage,
      metaTitle:        data.metaTitle        || data.title || '',
      metaDescription:  data.metaDescription  || '',
      datePublished:    data.datePublished     || new Date().toISOString(),
      techStack:        data.techStack        || [],
      keyResult:        data.keyResult        || '',
      content,
    });
  }

  // Primary: order ASC (studies with order field set come first).
  // Fallback: datePublished DESC for studies without explicit order.
  return studies.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return  1;
    return new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime();
  });
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
  return getAllCaseStudies().find((cs) => cs.slug === slug) || null;
}

export function getOtherCaseStudies(slug: string, limit = 2): CaseStudy[] {
  return getAllCaseStudies().filter((cs) => cs.slug !== slug).slice(0, limit);
}
