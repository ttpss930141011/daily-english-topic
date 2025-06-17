import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Topic } from '@/types/topic';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export async function getAllTopics(): Promise<Topic[]> {
  const fileNames = fs.readdirSync(postsDirectory);
  const topics = fileNames
    .filter(name => name.endsWith('.md'))
    .map((name) => {
      const fullPath = path.join(postsDirectory, name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      // 從檔名提取日期 (格式: title-DDMMYYYY.md)
      const dateMatch = name.match(/(\d{8})\.md$/);
      const dateStr = dateMatch ? dateMatch[1] : '';
      
      // 轉換日期格式從 DDMMYYYY 到 YYYY-MM-DD
      let formattedDate = '';
      if (dateStr && dateStr.length === 8) {
        const day = dateStr.substring(0, 2);
        const month = dateStr.substring(2, 4);
        const year = dateStr.substring(4, 8);
        formattedDate = `${year}-${month}-${day}`;
      }

      const slug = name.replace(/\.md$/, '');
      
      return {
        slug,
        title: data.title || '',
        date: formattedDate,
        category: data.category || 'GENERAL',
        redditUrl: data.reddit_url || '',
        content,
        frontmatter: data,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return topics;
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // 從檔名提取日期
    const dateMatch = slug.match(/(\d{8})$/);
    const dateStr = dateMatch ? dateMatch[1] : '';
    
    let formattedDate = '';
    if (dateStr && dateStr.length === 8) {
      const day = dateStr.substring(0, 2);
      const month = dateStr.substring(2, 4);
      const year = dateStr.substring(4, 8);
      formattedDate = `${year}-${month}-${day}`;
    }

    return {
      slug,
      title: data.title || '',
      date: formattedDate,
      category: data.category || 'GENERAL',
      redditUrl: data.reddit_url || '',
      content,
      frontmatter: data,
    };
  } catch {
    return null;
  }
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}