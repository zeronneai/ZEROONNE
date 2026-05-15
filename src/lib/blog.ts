import fm from 'front-matter';

const modules = import.meta.glob('/src/content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  coverImage?: string;
  content: string;
  featured?: boolean;
}

export function getAllPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const path in modules) {
    const raw = modules[path];
    const parsed = fm(raw);
    const data = parsed.attributes as any;
    const content = parsed.body;
    const slug = path.split('/').pop()?.replace('.md', '') || '';

    posts.push({
      slug,
      title: data.title || 'Untitled',
      description: data.description || '',
      author: data.author || 'Primo AI Studio',
      date: data.date || new Date().toISOString(),
      readTime: data.readTime || '5 min read',
      category: data.category || 'General',
      tags: data.tags || [],
      coverImage: data.coverImage,
      content,
      featured: data.featured || false,
    });
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  return getAllPosts().find((p) => p.slug === slug) || null;
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return [];

  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .filter(
      (p) =>
        p.category === current.category ||
        p.tags.some((t) => current.tags.includes(t))
    )
    .slice(0, limit);
}
