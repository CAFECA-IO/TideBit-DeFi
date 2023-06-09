import {readdir, readFile} from 'fs/promises';
import matter from 'gray-matter';
import {marked} from 'marked';
import {ETH_NEWS_FOLDER} from '../constants/config';

export interface IPost {
  date: string;
  title: string;
  body: string;
  slug?: string;
}

export async function getPost(slug: string): Promise<IPost | null> {
  try {
    const source = await readFile(`src/news/eth/${slug}.md`, 'utf-8');
    const {
      data: {date, title},
      content,
    } = matter(source);
    const body = marked(content);

    return {date, title, body};
  } catch (error) {
    // Info: (20230609 - Shirley) If the file can't be read (for example, if it doesn't exist), return null
    return null;
  }
}

export async function getPosts(): Promise<IPost[]> {
  const slugs = await getSlugs();
  const posts: IPost[] = [];
  for (const slug of slugs) {
    const post = await getPost(slug);
    if (post) {
      posts.push({slug, ...post});
    }
  }
  return posts;
}

export async function getSlugs(): Promise<string[]> {
  const suffix = '.md';
  const files = await readdir(ETH_NEWS_FOLDER);
  return files.filter(file => file.endsWith(suffix)).map(file => file.slice(0, -suffix.length));
}
