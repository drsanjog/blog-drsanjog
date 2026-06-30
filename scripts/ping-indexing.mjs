#!/usr/bin/env node
/**
 * Pings Google Indexing API + IndexNow after a new post is published.
 *
 * Usage:
 *   node scripts/ping-indexing.mjs https://blog.drsanjog.com/blog/some-slug
 *   node scripts/ping-indexing.mjs   # reads .last-published-url if no arg
 *
 * Required env vars (add to .env.local):
 *   GOOGLE_SERVICE_ACCOUNT_JSON  — base64-encoded Google service account JSON
 *                                  (see README comment below)
 *   INDEXNOW_KEY                 — any random string (must match /public/[key].txt)
 *
 * Google setup (one-time):
 *   1. Go to console.cloud.google.com → create project → enable "Web Search Indexing API"
 *   2. IAM → Service Accounts → create service account → generate JSON key
 *   3. In Google Search Console → Settings → Users → add the service account email as Owner
 *   4. base64-encode the JSON: base64 -i service-account.json | tr -d '\n'
 *   5. Add the result as GOOGLE_SERVICE_ACCOUNT_JSON in .env.local
 */

import { createSign } from 'crypto'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ── Resolve target URL ──────────────────────────────────────────────────────
let targetUrl = process.argv[2]

if (!targetUrl) {
  const urlFile = join(ROOT, '.last-published-url')
  if (existsSync(urlFile)) {
    targetUrl = readFileSync(urlFile, 'utf8').trim()
  }
}

if (!targetUrl) {
  console.error('❌ No URL provided. Pass as arg or ensure .last-published-url exists.')
  process.exit(1)
}

console.log(`\n→ Requesting indexing for: ${targetUrl}`)

// ── IndexNow (Bing / Yandex / Google via partnership) ──────────────────────
async function pingIndexNow(url) {
  const key = process.env.INDEXNOW_KEY
  if (!key) {
    console.warn('   IndexNow: skipped (INDEXNOW_KEY not set)')
    return
  }

  const host = new URL(url).hostname
  const body = {
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: [url],
  }

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    })
    if (res.status === 200 || res.status === 202) {
      console.log(`   ✅ IndexNow: submitted (${res.status})`)
    } else {
      const text = await res.text()
      console.warn(`   ⚠️  IndexNow: ${res.status} — ${text}`)
    }
  } catch (e) {
    console.warn(`   ⚠️  IndexNow: ${e.message}`)
  }
}

// ── Google Indexing API ─────────────────────────────────────────────────────
async function pingGoogle(url) {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!b64) {
    console.warn('   Google Indexing API: skipped (GOOGLE_SERVICE_ACCOUNT_JSON not set)')
    return
  }

  let sa
  try {
    sa = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'))
  } catch {
    console.error('   ❌ Google Indexing API: failed to parse GOOGLE_SERVICE_ACCOUNT_JSON')
    return
  }

  try {
    // Build JWT
    const now = Math.floor(Date.now() / 1000)
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
    const claims = Buffer.from(JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/indexing',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    })).toString('base64url')

    const sign = createSign('RSA-SHA256')
    sign.update(`${header}.${claims}`)
    const sig = sign.sign(sa.private_key, 'base64url')
    const jwt = `${header}.${claims}.${sig}`

    // Exchange JWT for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    })

    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) {
      console.warn(`   ⚠️  Google Indexing API: token exchange failed — ${JSON.stringify(tokenData)}`)
      return
    }

    // Submit URL to Indexing API
    const indexRes = await fetch(
      'https://indexing.googleapis.com/v3/urlNotifications:publish',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenData.access_token}`,
        },
        body: JSON.stringify({ url, type: 'URL_UPDATED' }),
      }
    )

    if (indexRes.ok) {
      const data = await indexRes.json()
      console.log(`   ✅ Google Indexing API: submitted — notifyTime: ${data.urlNotificationMetadata?.latestUpdate?.notifyTime ?? 'ok'}`)
    } else {
      const text = await indexRes.text()
      console.warn(`   ⚠️  Google Indexing API: ${indexRes.status} — ${text}`)
    }
  } catch (e) {
    console.warn(`   ⚠️  Google Indexing API: ${e.message}`)
  }
}

// ── Also ping sitemap ───────────────────────────────────────────────────────
async function pingSitemap() {
  const sitemapUrl = 'https://blog.drsanjog.com/sitemap.xml'
  // IndexNow covers Bing; Google discovers via crawl after Indexing API call.
  // Bing's sitemap ping still works.
  try {
    const res = await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`)
    console.log(`   ✅ Bing sitemap ping: ${res.status}`)
  } catch (e) {
    console.warn(`   ⚠️  Bing sitemap ping: ${e.message}`)
  }
}

// ── Run all ─────────────────────────────────────────────────────────────────
await Promise.all([
  pingIndexNow(targetUrl),
  pingGoogle(targetUrl),
  pingSitemap(),
])

console.log('\n→ Indexing pings complete.\n')
