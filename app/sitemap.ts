import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'
import { SITE_URL } from '@/lib/constants'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = site.sitemapStaticPages.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.dateModified ?? post.frontmatter.date),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  return [...staticPages, ...postPages]
}
