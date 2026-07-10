import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'
import { SITE_URL } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Location landing pages — high priority for GEO
    {
      url: `${SITE_URL}/blog/plastic-surgery-bengaluru`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog/cosmetic-surgery-dubai`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // FAQ page
    {
      url: `${SITE_URL}/blog/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Pillar / topic-cluster hub
    {
      url: `${SITE_URL}/blog/body-contouring`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.dateModified ?? post.frontmatter.date),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  return [...staticPages, ...postPages]
}
