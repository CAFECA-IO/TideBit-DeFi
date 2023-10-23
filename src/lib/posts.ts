import {readdir, readFile, stat} from 'fs/promises';
import matter from 'gray-matter';
import {marked} from 'marked';
import {join} from 'path';
import {NEWS_FOLDER} from '../constants/config';

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
    return {slug, date, title, description, body};
  } catch (error) {
    // Info: (20230609 - Shirley) If the file can't be read (for example, if it doesn't exist), return null
    return null;
  }
}

export async function getPosts(src?: string): Promise<IPost[]> {
  const posts: IPost[] = [];
  if (!src) {
    const directories = await getDirectories(NEWS_FOLDER);
    for (const directory of directories) {
      const slugs = await getSlugs(directory);
      if (!slugs) continue;
      for (const slug of slugs) {
        const post = await getPost(directory, slug);
        if (post) {
          posts.push({slug, ...post});
        }
      }
    }
  } else {
    const slugs = await getSlugs(src);
    if (!slugs) return [];
    for (const slug of slugs) {
      const post = await getPost(src, slug);
      if (post) {
        posts.push({slug, ...post});
      }
    }
  }
  return posts;
}

export async function getDirectories(src: string): Promise<string[]> {
  try {
    const subdirs = await readdir(src);
    const directories = [];

    for (const subdir of subdirs) {
      const regex = /^[a-zA-Z0-9_]+$/;
      const isValidSubdir = regex.test(subdir);

      if (!isValidSubdir) continue;

      const absolutePath = join(src, subdir);
      const isDirectory = (await stat(absolutePath)).isDirectory();

      if (isDirectory && isValidSubdir) {
        directories.push(absolutePath);
      }
    }

    return directories;
  } catch (error) {
    // Info: do nothing if the directory doesn't exist (20230616 - Shirley)
    // eslint-disable-next-line no-console
    console.error(`Error fetching subdirectories for ${src}:`, error);
    return [];
  }
}

export async function getSlugs(src: string): Promise<string[] | undefined> {
  const suffix = '.md';
  try {
    const files = await readdir(src);
    return files.filter(file => file.endsWith(suffix)).map(file => file.slice(0, -suffix.length));
  } catch (e) {
    // Info: do nothing if the directory doesn't exist (20230616 - Shirley)
  }
}

// Info: Exclude the certain slugs from the list (20230613 - Shirley)
export async function getFilteredSlugs(
  src: string,
  exclude: string[]
): Promise<string[] | undefined> {
  const suffix = '.md';
  try {
    const files = await readdir(src);
    const result = files
      .filter(file => file.endsWith(suffix))
      .map(file => file.slice(0, -suffix.length))
      .filter(slug => !exclude.includes(slug));

    return result;
  } catch (e) {
    // Info: do nothing if the directory doesn't exist (20230616 - Shirley)
  }
}

// Info: Exclude the certain posts from the list by the slug id (20230613 - Shirley)
export async function getFilteredPosts(src: string, exclude: string[]): Promise<IPost[]> {
  const slugs = await getFilteredSlugs(src, exclude);
  if (!slugs) return [];
  const posts: IPost[] = [];
  for (const slug of slugs) {
    const post = await getPost(src, slug);
    if (post) {
      posts.push({slug, ...post});
    }
  }
  return posts;
}

export async function getDirectoryById(id: string): Promise<string | null> {
  const directories = await getDirectories(NEWS_FOLDER);
  for (const dir of directories) {
    const slugs = await getSlugs(dir);
    if (slugs && slugs.includes(id)) {
      return dir;
    }
  }
  return null;
}
