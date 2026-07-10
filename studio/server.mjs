#!/usr/bin/env node
/**
 * Blog Studio — local-only server for blog.drsanjog.com
 *
 * A single-user desktop tool. Lets Dr. Sharma:
 *   • type a topic / steering note
 *   • upload his own cover + body photos (Unsplash fills any empty slot)
 *   • watch the post stream in live
 *   • review / edit, then Publish (writes MDX, git commit + push, pings indexing)
 *
 * Runs ONLY on the local machine — never part of the Railway deployment.
 * Launch:  node studio/server.mjs   (or the "Blog Studio.command" launcher)
 *
 * Zero external dependencies — pure Node.
 */

import http from 'http'
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs'
import { join, extname } from 'path'
import { spawn } from 'child_process'
import {
  ROOT_DIR, POSTS_DIR, IMAGES_DIR, MODEL, todayISO,
  getExistingPosts, fetchUnsplashImage,
  buildSystemPrompt, buildUserMessage, buildBodyImageInstructions,
  slugify, stripFences, forceDate, applyCover, deriveCoverAlt, upsertDateModified,
  parseTitle, parseCoverQuery, suggestTopic,
} from '../scripts/lib/blog-core.mjs'

const PORT = 4455
const HERE = new URL('.', import.meta.url).pathname

// ── Load .env.local into process.env (ANTHROPIC_API_KEY, UNSPLASH_ACCESS_KEY …)
function loadEnv() {
  const envPath = join(ROOT_DIR, '.env.local')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}
loadEnv()

if (!existsSync(IMAGES_DIR)) mkdirSync(IMAGES_DIR, { recursive: true })

// ── tiny helpers ────────────────────────────────────────────
function sendJSON(res, status, obj) {
  const body = JSON.stringify(obj)
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) })
  res.end(body)
}

function readBody(req, limit = 30 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', c => {
      size += c.length
      if (size > limit) { reject(new Error('Payload too large')); req.destroy() }
      else chunks.push(c)
    })
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

const EXT_BY_MIME = {
  'image/jpeg': '.jpg', 'image/jpg': '.jpg', 'image/png': '.png',
  'image/webp': '.webp', 'image/gif': '.gif', 'image/avif': '.avif',
}

// Save a base64 data URL to public/images/blog and return its public path.
function saveUpload(dataUrl, originalName) {
  const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
  if (!m) throw new Error('Bad image data')
  const mime = m[1]
  const ext = EXT_BY_MIME[mime] || extname(originalName || '') || '.jpg'
  const name = `studio-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
  writeFileSync(join(IMAGES_DIR, name), Buffer.from(m[2], 'base64'))
  return `/images/blog/${name}`
}

// ── Claude streaming ────────────────────────────────────────
async function streamClaude({ system, user, onDelta }) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8000,
      system,
      stream: true,
      messages: [{ role: 'user', content: user }],
    }),
  })

  if (!res.ok || !res.body) {
    const err = await res.text().catch(() => res.statusText)
    throw new Error(`Claude API error ${res.status}: ${err}`)
  }

  let full = ''
  let buffer = ''
  const decoder = new TextDecoder()
  for await (const chunk of res.body) {
    buffer += decoder.decode(chunk, { stream: true })
    const events = buffer.split('\n\n')
    buffer = events.pop() // keep incomplete tail
    for (const evt of events) {
      const dataLine = evt.split('\n').find(l => l.startsWith('data:'))
      if (!dataLine) continue
      const payload = dataLine.slice(5).trim()
      if (!payload || payload === '[DONE]') continue
      let json
      try { json = JSON.parse(payload) } catch { continue }
      if (json.type === 'content_block_delta' && json.delta?.text) {
        full += json.delta.text
        onDelta(json.delta.text)
      } else if (json.type === 'error') {
        throw new Error(json.error?.message || 'stream error')
      }
    }
  }
  return full
}

// ── Route: generate (SSE) ───────────────────────────────────
async function handleGenerate(req, res) {
  const { topicHint = '', cover = null, body = [null, null] } = JSON.parse((await readBody(req)).toString() || '{}')

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  })
  const sse = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)

  try {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY missing in .env.local')

    const today = todayISO()
    const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY
    const { existingTitles, internalLinkList } = getExistingPosts()

    // Resolve the 2 body images: uploaded path wins; else Unsplash fallback.
    const fallbackQueries = ['surgical consultation clinic patient', 'medical recovery hospital bed']
    const bodyImages = []
    for (let i = 0; i < 2; i++) {
      if (body[i]) {
        bodyImages.push({ url: body[i], credit: 'provided by Dr. Sharma' })
        sse('status', { msg: `Using your uploaded body image ${i + 1}` })
      } else {
        sse('status', { msg: `Fetching a stock body image ${i + 1} from Unsplash…` })
        const img = await fetchUnsplashImage(fallbackQueries[i], UNSPLASH_KEY)
        bodyImages.push(img)
      }
    }

    const bodyImageInstructions = buildBodyImageInstructions(bodyImages)
    const system = buildSystemPrompt(today)
    const user = buildUserMessage({ existingTitles, internalLinkList, bodyImageInstructions, topicHint })

    sse('status', { msg: 'Generating the post with Claude…' })
    let mdx = await streamClaude({ system, user, onDelta: text => sse('delta', { text }) })

    // Finalize
    mdx = forceDate(stripFences(mdx), today)
    const title = parseTitle(mdx)
    if (!title) throw new Error('Generated content had no title')
    const slug = slugify(title)

    // Resolve cover: uploaded wins; else Unsplash on the model's suggested query.
    // Alt text is always derived from the procedure — never a generic stock caption.
    const coverAlt = deriveCoverAlt(mdx)
    let coverForFm
    if (cover) {
      coverForFm = { url: cover, alt: coverAlt, credit: '' }
      sse('status', { msg: 'Using your uploaded cover image' })
    } else {
      const q = parseCoverQuery(mdx)
      sse('status', { msg: `Fetching cover image from Unsplash: "${q}"…` })
      const c = await fetchUnsplashImage(q, UNSPLASH_KEY)
      coverForFm = c ? { url: c.url, alt: coverAlt, credit: `${c.credit} / Unsplash` } : null
    }
    mdx = applyCover(mdx, coverForFm)

    const exists = existsSync(join(POSTS_DIR, `${slug}.mdx`))
    sse('done', {
      mdx, slug, title,
      exists,
      coverUrl: coverForFm?.url ?? null,
      liveUrl: `https://blog.drsanjog.com/blog/${slug}`,
    })
  } catch (e) {
    sse('failed', { error: e.message })
  } finally {
    res.end()
  }
}

// ── Route: publish ──────────────────────────────────────────
function run(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { cwd: ROOT_DIR, ...opts })
    let out = '', err = ''
    p.stdout.on('data', d => (out += d))
    p.stderr.on('data', d => (err += d))
    p.on('close', code => resolve({ code, out, err }))
  })
}

// Delete studio-uploaded images that the published MDX doesn't reference.
function cleanupOrphanUploads(keepPaths) {
  const keep = new Set(keepPaths.map(p => p.replace('/images/blog/', '')))
  for (const f of readdirSync(IMAGES_DIR)) {
    if (f.startsWith('studio-') && !keep.has(f)) {
      try { unlinkSync(join(IMAGES_DIR, f)) } catch {}
    }
  }
}

async function handlePublish(req, res) {
  try {
    const { mdx, slug } = JSON.parse((await readBody(req)).toString() || '{}')
    if (!mdx || !slug) return sendJSON(res, 400, { ok: false, error: 'Missing mdx or slug' })

    const outPath = join(POSTS_DIR, `${slug}.mdx`)
    // Re-publishing an existing slug is an edit → stamp dateModified with today
    // (keeps the original datePublished). New posts keep publish date only.
    const isEdit = existsSync(outPath)
    let finalMdx = forceDate(mdx.trim(), todayISO())
    if (isEdit) finalMdx = upsertDateModified(finalMdx, todayISO())
    finalMdx += '\n'
    writeFileSync(outPath, finalMdx, 'utf8')

    // Which local images does this post reference?
    const imgRefs = [...new Set((finalMdx.match(/\/images\/blog\/[A-Za-z0-9._-]+/g) || []))]
    cleanupOrphanUploads(imgRefs)

    const liveUrl = `https://blog.drsanjog.com/blog/${slug}`
    writeFileSync(join(ROOT_DIR, '.last-published-url'), liveUrl, 'utf8')

    // git add (post + only the referenced images), commit, push
    const toAdd = [`content/posts/${slug}.mdx`, ...imgRefs.map(p => 'public' + p)]
    await run('git', ['add', ...toAdd])
    const commit = await run('git', ['commit', '-m', `studio: publish ${slug}`])
    const push = await run('git', ['push', 'origin', 'main'])
    if (push.code !== 0) {
      return sendJSON(res, 500, {
        ok: false, error: 'git push failed', detail: (push.err || push.out).trim(),
      })
    }

    // Ping indexing (non-fatal)
    const ping = await run('node', ['scripts/ping-indexing.mjs'], { env: process.env })

    sendJSON(res, 200, {
      ok: true,
      liveUrl,
      committed: /publish/.test(commit.out) || commit.code === 0,
      git: (commit.out + push.out).trim(),
      ping: (ping.out || ping.err).trim(),
    })
  } catch (e) {
    sendJSON(res, 500, { ok: false, error: e.message })
  }
}

// ── Server ──────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
      const html = readFileSync(join(HERE, 'index.html'))
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      return res.end(html)
    }
    if (req.method === 'GET' && req.url === '/api/suggest') {
      const { existingTitles } = getExistingPosts()
      return sendJSON(res, 200, { topic: suggestTopic(existingTitles) })
    }
    if (req.method === 'POST' && req.url === '/api/upload') {
      const { dataUrl, filename } = JSON.parse((await readBody(req)).toString() || '{}')
      return sendJSON(res, 200, { path: saveUpload(dataUrl, filename) })
    }
    if (req.method === 'POST' && req.url === '/api/generate') {
      return handleGenerate(req, res)
    }
    if (req.method === 'POST' && req.url === '/api/publish') {
      return handlePublish(req, res)
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not found')
  } catch (e) {
    sendJSON(res, 500, { ok: false, error: e.message })
  }
})

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`
  console.log(`\n  🩺  Blog Studio running at ${url}\n`)
  console.log(`  ANTHROPIC_API_KEY : ${process.env.ANTHROPIC_API_KEY ? 'loaded ✓' : 'MISSING ✗'}`)
  console.log(`  UNSPLASH_ACCESS_KEY: ${process.env.UNSPLASH_ACCESS_KEY ? 'loaded ✓' : 'missing (uploads only)'}\n`)
  // Best-effort: open the browser (macOS)
  spawn('open', [url]).on('error', () => {})
})
