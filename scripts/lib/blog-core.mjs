/**
 * Shared blog-post core for blog.drsanjog.com
 * Used by studio/server.mjs (the local Blog Studio app).
 *
 * Site profiles, slug/date handling — the parts of the pipeline that stay the
 * same regardless of how a post's content gets written.
 */

import { dirname } from 'path'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const ROOT_DIR = join(__dirname, '..', '..')
export const POSTS_DIR = join(ROOT_DIR, 'content', 'posts')
export const PUBLIC_DIR = join(ROOT_DIR, 'public')
export const IMAGES_DIR = join(PUBLIC_DIR, 'images', 'blog')
const ARTI_POSTS_DIR = join(ROOT_DIR, 'content', 'arti', 'posts')

export const todayISO = () => new Date().toISOString().split('T')[0]

// ────────────────────────────────────────────────────────────
// Multi-site profiles — Blog Studio's "site" selector reads from this.
// ────────────────────────────────────────────────────────────
export const SITE_PROFILES = {
  sanjog: {
    key: 'sanjog',
    label: 'Dr. Sanjog Sharma — blog.drsanjog.com',
    postsDir: POSTS_DIR,
    postsDirRel: 'content/posts',
    siteUrl: 'https://blog.drsanjog.com',
    gitBranch: 'main',
  },
  arti: {
    key: 'arti',
    label: 'Dr. Arti Sharma — blog.drarti.in',
    postsDir: ARTI_POSTS_DIR,
    postsDirRel: 'content/arti/posts',
    siteUrl: 'https://blog.drarti.in',
    gitBranch: 'multi-site',
  },
}

export function resolveProfile(site) {
  return SITE_PROFILES[site] || SITE_PROFILES.sanjog
}

// ────────────────────────────────────────────────────────────
// Slug / date helpers
// ────────────────────────────────────────────────────────────
export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 70)
}

// Force the frontmatter date to `today` — a fresh import may sit for days
// before it's actually published, so the date is re-stamped at publish time
// rather than trusting whatever was written at import time.
export function forceDate(mdx, today = todayISO()) {
  if (/^date:\s*.*/m.test(mdx)) {
    return mdx.replace(/^date:\s*.*/m, `date: "${today}"`)
  }
  return mdx.replace(/^(title:.*)$/m, `$1\ndate: "${today}"`)
}

// Set/replace the dateModified frontmatter field (used when re-publishing an
// existing slug as an edit) — powers the "Last updated" line and
// schema/sitemap dateModified.
export function upsertDateModified(mdx, date = todayISO()) {
  if (/^dateModified:\s*.*/m.test(mdx)) {
    return mdx.replace(/^dateModified:\s*.*/m, `dateModified: "${date}"`)
  }
  return mdx.replace(/^(date:\s*.*)$/m, `$1\ndateModified: "${date}"`)
}
