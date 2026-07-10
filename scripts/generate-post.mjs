#!/usr/bin/env node
/**
 * Autonomous blog post generator for blog.drsanjog.com — v2.1
 * Runs via Claude scheduled tasks twice weekly (Tuesday + Friday 9 AM IST)
 * Uses Claude API for content, Unsplash API for cover + 2 body images
 * Requires: ANTHROPIC_API_KEY, UNSPLASH_ACCESS_KEY env vars
 *
 * Content/prompt logic lives in scripts/lib/blog-core.mjs (shared with Blog Studio).
 */

import { writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import {
  ROOT_DIR, POSTS_DIR, MODEL, todayISO,
  getExistingPosts, fetchUnsplashImage,
  buildSystemPrompt, buildUserMessage, buildBodyImageInstructions,
  slugify, stripFences, forceDate, applyCover, deriveCoverAlt, parseTitle, parseCoverQuery,
} from './lib/blog-core.mjs'

const today = todayISO()
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY

const { existingTitles, internalLinkList } = getExistingPosts()

// ────────────────────────────────────────────────────────────
// 1. Pre-fetch body images from Unsplash BEFORE calling Claude
// ────────────────────────────────────────────────────────────
let bodyImage2 = null
let bodyImage3 = null

try {
  console.log('→ Pre-fetching body images from Unsplash...')
  ;[bodyImage2, bodyImage3] = await Promise.all([
    fetchUnsplashImage('surgical consultation clinic patient', UNSPLASH_KEY),
    fetchUnsplashImage('medical recovery hospital bed', UNSPLASH_KEY),
  ])
  if (bodyImage2) console.log(`   Body image 2 by: ${bodyImage2.credit}`)
  if (bodyImage3) console.log(`   Body image 3 by: ${bodyImage3.credit}`)
} catch (e) {
  console.warn(`   Body image pre-fetch failed: ${e.message}`)
}

// ────────────────────────────────────────────────────────────
// 2. Build prompts
// ────────────────────────────────────────────────────────────
const bodyImageInstructions = buildBodyImageInstructions([bodyImage2, bodyImage3])
const SYSTEM_PROMPT = buildSystemPrompt(today)
const userMessage = buildUserMessage({ existingTitles, internalLinkList, bodyImageInstructions })

// ────────────────────────────────────────────────────────────
// 3. Generate post via Claude API
// ────────────────────────────────────────────────────────────
console.log('→ Calling Claude API to generate post...')
const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
  },
  body: JSON.stringify({
    model: MODEL,
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  }),
})

if (!claudeRes.ok) {
  const err = await claudeRes.text()
  throw new Error(`Claude API error ${claudeRes.status}: ${err}`)
}

const claudeData = await claudeRes.json()
let mdx = forceDate(stripFences(claudeData.content[0].text), today)

// ────────────────────────────────────────────────────────────
// 4. Parse required frontmatter fields
// ────────────────────────────────────────────────────────────
const title = parseTitle(mdx)
if (!title) throw new Error('No title in frontmatter')

const coverQuery = parseCoverQuery(mdx)
const slug = slugify(title)

const outPath = join(POSTS_DIR, `${slug}.mdx`)
if (existsSync(outPath)) throw new Error(`Slug already exists: ${slug}`)

// ────────────────────────────────────────────────────────────
// 5. Fetch cover image from Unsplash
// ────────────────────────────────────────────────────────────
console.log(`→ Fetching cover image from Unsplash for: "${coverQuery}"`)
let coverImage = null
try {
  coverImage = await fetchUnsplashImage(coverQuery, UNSPLASH_KEY)
  if (coverImage) {
    console.log(`   Cover photo by: ${coverImage.credit}`)
  } else {
    console.warn('   Unsplash returned an error — skipping cover image')
  }
} catch (e) {
  console.warn(`   Cover image fetch failed: ${e.message}`)
}

mdx = applyCover(mdx, coverImage
  ? { url: coverImage.url, alt: deriveCoverAlt(mdx), credit: `${coverImage.credit} / Unsplash` }
  : null)

// ────────────────────────────────────────────────────────────
// 6. Write the MDX file
// ────────────────────────────────────────────────────────────
writeFileSync(outPath, mdx, 'utf8')

const liveUrl = `https://blog.drsanjog.com/blog/${slug}`
writeFileSync(join(ROOT_DIR, '.last-published-url'), liveUrl, 'utf8')

console.log(`✅ Post written: content/posts/${slug}.mdx`)
console.log(`   Title    : ${title}`)
console.log(`   Slug     : ${slug}`)
console.log(`   Cover    : ${coverImage?.url ?? 'none'}`)
console.log(`   Live URL : ${liveUrl}`)
