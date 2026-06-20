import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'
import { AUTHOR, SITE_URL } from '@/lib/constants'

export const dynamic = 'force-static'

export function GET() {
  const posts = getAllPosts()

  const body = `# ${AUTHOR.name} — Medical Blog

> ${SITE_URL}

## Purpose

This blog publishes factual, educational articles on plastic and reconstructive surgery, authored by ${AUTHOR.name} (${AUTHOR.credentials}). It is a content and SEO asset for Dr. Sharma's practice, distinct from the patient-facing consultation site.

## Author

- **Name:** ${AUTHOR.name}, ${AUTHOR.credentials}
- **Specialty:** ${AUTHOR.specialty}
- **Practice:** ${AUTHOR.clinic}, ${AUTHOR.city}, India
- **Karnataka Medical Council Registration:** ${AUTHOR.kmc}
- **DHA License:** ${AUTHOR.dha}
- **Training:** ${AUTHOR.training.join(', ')}
- **Main website:** ${AUTHOR.siteUrl}

## Content policy

All articles are written for general educational purposes. They do not constitute medical advice and do not replace an in-person consultation with a qualified surgeon. A medical disclaimer is displayed on every post page.

## Posts

${posts.map((p) => `- [${p.frontmatter.title}](${SITE_URL}/blog/${p.slug})\n  ${p.frontmatter.description}`).join('\n\n')}

## Additional pages

- [About Dr. Sanjog Sharma](${SITE_URL}/blog/about) — Author credentials, training, and registration details
`

  return new NextResponse(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
