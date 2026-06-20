#!/usr/bin/env node
/**
 * Autonomous blog post generator for blog.drsanjog.com
 * Runs via GitHub Actions twice weekly (Tuesday + Friday 9 AM IST)
 * Uses Claude API for content, Unsplash API for cover image
 * Requires: ANTHROPIC_API_KEY, UNSPLASH_ACCESS_KEY env vars
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const POSTS_DIR = join(__dirname, '..', 'content', 'posts')

// Read existing post titles so Claude doesn't repeat topics
const existingTitles = existsSync(POSTS_DIR)
  ? readdirSync(POSTS_DIR)
      .filter(f => f.endsWith('.mdx'))
      .map(f => {
        const raw = readFileSync(join(POSTS_DIR, f), 'utf8')
        const m = raw.match(/^title:\s*"(.+)"/m)
        return m ? m[1] : f.replace('.mdx', '')
      })
  : []

const today = new Date().toISOString().split('T')[0]

// ────────────────────────────────────────────────────────────
// 1. Generate post via Claude API
// ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You write SEO/AEO/GEO-optimised blog posts for Dr. Sanjog Sharma's medical blog at blog.drsanjog.com.

AUTHOR:
- Dr. Sanjog Sharma, MS, DNB — Plastic & Reconstructive Surgery
- Trained: Maulana Azad Medical College + AIIMS New Delhi
- KMC: DLH 2020 0000540 KTK | DHA: 24430721
- Clinic: Aesthetica Veda Clinic, Whitefield, Bengaluru
- Procedures: VASER liposuction, HD lipo, gynecomastia, tummy tuck, mommy makeover, arm lift, thigh lift, BBL, male body contouring, post-weight-loss body contouring

BLOG ANGLE: Dr. Sharma brings high-quality international body contouring to Bangalore — trained in techniques from leading centres in the US, UK, and Europe, now available at Whitefield.

AUDIENCE: Educated adults in Bengaluru/India actively researching body contouring. They compare options, want factual information, and trust surgeons who explain clearly.

TONE: Precise, evidence-based, authoritative but accessible. Like a knowledgeable surgeon explaining clearly to a patient.

NMC INDIA COMPLIANCE — MANDATORY:
- NO patient testimonials or reviews
- NO before/after patient images
- NO superlatives: "best", "No. 1", "world-class", "leading", "top"
- NO guaranteed outcomes: "you will get", "guaranteed", "assured results"
- NO comparative claims against other surgeons or clinics
- Content must be factual and educational only

OUTPUT: Return ONLY a valid MDX file. No preamble, no explanation, no code fences.

FRONTMATTER SCHEMA (every field required):
---
title: "Post Title Here"
description: "One to two sentence meta description for Google."
date: "${today}"
targetKeyword: "primary seo keyword phrase"
author: "Dr. Sanjog Sharma"
tags: ["tag1", "tag2", "tag3", "tag4"]
coverImage: "2-3 word unsplash search term for a relevant medical/clinical image"
faqs:
  - question: "Common patient question?"
    answer: "Factual, specific answer in 2-4 sentences."
  - question: "..."
    answer: "..."
---

CONTENT:
- 900–1200 words
- H2 subheadings (##) and H3 (###) where appropriate
- At least one markdown table (comparison, timeline, candidate criteria, or cost breakdown)
- Reference international standards/techniques where relevant (e.g., "techniques refined in the US and Europe")
- Mention Bengaluru context naturally (e.g., "at our Whitefield clinic", "patients in Bengaluru")
- Do NOT write a medical disclaimer — the site renders it automatically
- Write 5–6 FAQs targeting patient questions that appear in Google's "People Also Ask"`

const userMessage = `Write a new blog post on a body contouring topic that Dr. Sanjog Sharma performs.

ALREADY PUBLISHED — do not repeat these topics:
${existingTitles.map(t => `• ${t}`).join('\n')}

TOPIC IDEAS (pick the best one not yet covered, or propose a new relevant one):
• VASER liposuction vs traditional liposuction — what's the difference
• High-definition (HD) liposuction — achieving muscle definition
• What is a mommy makeover — which procedures are combined
• Brazilian Butt Lift (BBL) — what patients in India need to know
• Arm lift (brachioplasty) — when liposuction alone isn't enough
• Thigh lift surgery — inner vs outer thigh contouring
• Male body contouring — gynecomastia and male liposuction
• Body contouring after massive weight loss
• Skin quality and liposuction — what determines results
• Recovery after combined body contouring procedures
• International body contouring techniques now in Bengaluru
• Liposuction cost in Bangalore — what varies and why
• Compression garments after liposuction — why they matter
• VASER Hi-Def — the technique for athletic definition
• Post-bariatric body contouring — the full picture

Write the complete MDX file now, starting with the --- frontmatter block.`

console.log('→ Calling Claude API to generate post...')
const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: 5000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  }),
})

if (!claudeRes.ok) {
  const err = await claudeRes.text()
  throw new Error(`Claude API error ${claudeRes.status}: ${err}`)
}

const claudeData = await claudeRes.json()
let mdx = claudeData.content[0].text.trim()

// Strip accidental markdown fences
mdx = mdx.replace(/^```(?:mdx|md)?\n/, '').replace(/\n```$/, '')

// ────────────────────────────────────────────────────────────
// 2. Parse required frontmatter fields
// ────────────────────────────────────────────────────────────
const fmMatch = mdx.match(/^---\n([\s\S]+?)\n---/)
if (!fmMatch) throw new Error('No frontmatter found in generated content')

const fm = fmMatch[1]
const titleMatch = fm.match(/^title:\s*"(.+)"/m)
if (!titleMatch) throw new Error('No title in frontmatter')
const title = titleMatch[1]

const coverQueryMatch = fm.match(/^coverImage:\s*"(.+)"/m)
const coverQuery = coverQueryMatch ? coverQueryMatch[1] : 'plastic surgery medical clinic'

// Derive slug from title
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, '')
  .trim()
  .replace(/\s+/g, '-')
  .slice(0, 75)

const outPath = join(POSTS_DIR, `${slug}.mdx`)
if (existsSync(outPath)) throw new Error(`Slug already exists: ${slug}`)

// ────────────────────────────────────────────────────────────
// 3. Fetch cover image from Unsplash
// ────────────────────────────────────────────────────────────
console.log(`→ Fetching Unsplash image for: "${coverQuery}"`)
let imageUrl = null
let imageAlt = coverQuery
let imageCredit = ''

try {
  const uRes = await fetch(
    `https://api.unsplash.com/photos/random?query=${encodeURIComponent(coverQuery)}&orientation=landscape&content_filter=high`,
    { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }
  )
  if (uRes.ok) {
    const photo = await uRes.json()
    imageUrl = `${photo.urls.regular}&w=1200&q=80`
    imageAlt = (photo.alt_description || coverQuery).replace(/"/g, "'")
    imageCredit = `${photo.user.name} / Unsplash`
    console.log(`   Photo by: ${photo.user.name}`)
  } else {
    console.warn(`   Unsplash returned ${uRes.status} — skipping image`)
  }
} catch (e) {
  console.warn(`   Unsplash fetch failed — skipping image: ${e.message}`)
}

// Replace coverImage placeholder in frontmatter with actual data
if (imageUrl) {
  mdx = mdx.replace(
    /^coverImage:\s*".+"/m,
    `coverImage: "${imageUrl}"\ncoverImageAlt: "${imageAlt}"\ncoverImageCredit: "${imageCredit}"`
  )
} else {
  // Remove the coverImage line if no image was fetched
  mdx = mdx.replace(/^coverImage:\s*".+"\n/m, '')
}

// ────────────────────────────────────────────────────────────
// 4. Write the MDX file
// ────────────────────────────────────────────────────────────
writeFileSync(outPath, mdx, 'utf8')

console.log(`✅ Post written: content/posts/${slug}.mdx`)
console.log(`   Title    : ${title}`)
console.log(`   Slug     : ${slug}`)
console.log(`   Image    : ${imageUrl ?? 'none (no image)'}`)
console.log(`   Live URL : https://blog.drsanjog.com/blog/${slug}`)
