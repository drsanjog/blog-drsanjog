import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'
import { AUTHOR, SITE_URL } from '@/lib/constants'

export const dynamic = 'force-static'

export function GET() {
  const posts = getAllPosts()

  const body = `# ${AUTHOR.name} — Medical Blog

> ${SITE_URL}

## Purpose

This blog publishes factual, educational articles on plastic and cosmetic surgery, authored by ${AUTHOR.name} (${AUTHOR.credentials}). It is a content and authority asset for Dr. Sharma's international practice spanning Dubai and Bengaluru.

## Author

- **Name:** ${AUTHOR.name}, ${AUTHOR.credentials}
- **Specialty:** ${AUTHOR.specialty}
- **Experience:** ${AUTHOR.yearsExperience} years | ${AUTHOR.proceduresPerYear} procedures/year
- **Membership:** ${AUTHOR.apsi}

### Dubai Practice (Primary)
${AUTHOR.dubaiClinics.map((c) => `- ${c.name}, ${c.location}`).join('\n')}
- DHA License: ${AUTHOR.dha}
- Dubai contact: ${AUTHOR.dubaiPhone}

### Bengaluru Practice (Selective Visits)
- ${AUTHOR.clinicRole}, ${AUTHOR.clinic}, ${AUTHOR.city}
- Karnataka Medical Council: ${AUTHOR.kmc}
- India contact: ${AUTHOR.bangalorePhone}

### Training
${AUTHOR.training.map((t) => `- ${t}`).join('\n')}

- **Main website:** ${AUTHOR.siteUrl}
- **Instagram:** ${AUTHOR.instagram}
- **LinkedIn:** ${AUTHOR.linkedin}

## Blog Focus

Dr. Sharma is an internationally practising plastic surgeon based in Dubai who performs selected complex body contouring cases for patients in Bengaluru. The blog covers:
- VASER liposuction and high-definition liposuction
- Body contouring after GLP-1 (Ozempic/Wegovy) weight loss
- Post-bariatric body contouring
- Tummy tuck, mommy makeover, arm lift, thigh lift
- Brazilian Butt Lift (BBL)
- Gynecomastia surgery
- Rhinoplasty and facial procedures
- Patient selection, recovery, and safety

## Content Policy

All articles are written for general educational purposes. They do not constitute medical advice and do not replace an in-person consultation with a qualified surgeon. A medical disclaimer is displayed on every post page. No patient testimonials, before/after images, or guaranteed outcomes are published (NMC India compliance).

## Posts

${posts.map((p) => `- [${p.frontmatter.title}](${SITE_URL}/blog/${p.slug})\n  ${p.frontmatter.description}`).join('\n\n')}

## Additional Pages

- [About Dr. Sanjog Sharma](${SITE_URL}/blog/about) — Full credentials, Dubai and Bengaluru practice details, training, and registrations
`

  return new NextResponse(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
