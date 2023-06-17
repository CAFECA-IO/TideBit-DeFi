import {readdir, readFile} from 'fs/promises';
import matter from 'gray-matter';
import {marked} from 'marked';

export interface IPost {
  date: number;
  title: string;
  description: string;
  body: string;
  slug?: string;
}

export async function getPost(src: string, slug: string): Promise<IPost | null> {
  try {
    const source = await readFile(`${src}/${slug}.md`, 'utf-8');
    const {
      data: {date, title, description},
      content,
    } = matter(source);

    marked.setOptions({headerIds: false, mangle: false});

    const body = marked(content);
    return {date, title, description, body};
  } catch (error) {
    // Info: (20230609 - Shirley) If the file can't be read (for example, if it doesn't exist), return null
    return null;
  }
}

export async function getPosts(src: string): Promise<IPost[]> {
  const slugs = await getSlugs(src);
  const posts: IPost[] = [];
  for (const slug of slugs) {
    const post = await getPost(src, slug);
    if (post) {
      posts.push({slug, ...post});
    }
  }
  return posts;
}

export async function getSlugs(src: string): Promise<string[]> {
  const suffix = '.md';
  const files = await readdir(src);
  return files.filter(file => file.endsWith(suffix)).map(file => file.slice(0, -suffix.length));
}

// Info: Exclude the certain slugs from the list (20230613 - Shirley)
export async function getFilteredSlugs(src: string, exclude: string[]): Promise<string[]> {
  const suffix = '.md';
  const files = await readdir(src);
  return files
    .filter(file => file.endsWith(suffix))
    .map(file => file.slice(0, -suffix.length))
    .filter(slug => !exclude.includes(slug));
}

// Info: Exclude the certain posts from the list by the slug id (20230613 - Shirley)
export async function getFilteredPosts(src: string, exclude: string[]): Promise<IPost[]> {
  const slugs = await getFilteredSlugs(src, exclude);
  const posts: IPost[] = [];
  for (const slug of slugs) {
    const post = await getPost(src, slug);
    if (post) {
      posts.push({slug, ...post});
    }
  }
  return posts;
}
