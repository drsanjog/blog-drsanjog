import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

export type FAQ = {
  question: string
  answer: string
}

export type HowToStep = {
  name: string
  text: string
}

export type PostFrontmatter = {
  title: string
  seoTitle?: string
  description: string
  date: string
  dateModified?: string
  targetKeyword: string
  keywords?: string[]
  author: string
  tags?: string[]
  faqs?: FAQ[]
  coverImage?: string
  coverImageAlt?: string
  coverImageCredit?: string
  // MedicalProcedure schema fields
  procedureName?: string
  procedureAlt?: string
  procedureBodyLocation?: string
  procedurePrep?: string
  procedureHow?: string
  procedureFollowup?: string
  // HowTo schema fields
  howToName?: string
  howToSteps?: HowToStep[]
}

export type PostMeta = {
  slug: string
  frontmatter: PostFrontmatter
  readingTime: string
}

export type Post = PostMeta & {
  content: string
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return []

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '')
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8')
      const { data, content } = matter(raw)
      return {
        slug,
        frontmatter: data as PostFrontmatter,
        readingTime: readingTime(content).text,
      }
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )
}

export function getPostBySlug(slug: string): Post | null {
  const filepath = path.join(POSTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filepath)) return null

  const raw = fs.readFileSync(filepath, 'utf8')
  const { data, content } = matter(raw)
  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content,
    readingTime: readingTime(content).text,
  }
}

export function getRelatedPosts(
  currentSlug: string,
  tags: string[] = [],
  count = 4
): PostMeta[] {
  return getAllPosts()
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => {
      const aMatches = (a.frontmatter.tags ?? []).filter((t) =>
        tags.includes(t)
      ).length
      const bMatches = (b.frontmatter.tags ?? []).filter((t) =>
        tags.includes(t)
      ).length
      return bMatches - aMatches
    })
    .slice(0, count)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
