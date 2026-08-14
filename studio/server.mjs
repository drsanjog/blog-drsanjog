#!/usr/bin/env node
/**
 * Blog Studio — local-only server for blog.drsanjog.com
 *
 * A single-user desktop tool. Lets Dr. Sharma:
 *   • upload his own cover + 2 body photos
 *   • paste a post as JSON (written by a Claude Project, not an API call)
 *   • review / edit, then Publish (writes MDX, git commit + push, pings indexing)
 *
 * No external API is called from here — no ANTHROPIC_API_KEY, no Unsplash.
 * The post itself is composed by hand in a Claude Project and pasted in as JSON;
 * this server only assembles it into MDX and does the git/publish plumbing.
 *
 * Runs ONLY on the local machine — never part of the Railway deployment.
 * Launch:  node studio/server.mjs   (or the "Blog Studio.command" launcher)
 */

import http from 'http'
import yaml from 'js-yaml'
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs'
import { join, extname } from 'path'
import { spawn } from 'child_process'
import { ROOT_DIR, IMAGES_DIR, todayISO, resolveProfile, SITE_PROFILES, slugify, forceDate, upsertDateModified } from '../scripts/lib/blog-core.mjs'

const PORT = 4455
const HERE = new URL('.', import.meta.url).pathname

const AUTHOR_BY_SITE = { sanjog: 'Dr. Sanjog Sharma', arti: 'Dr. Arti Sharma' }
const COVER_ALT_SUFFIX_BY_SITE = {
  sanjog: 'plastic surgery by Dr. Sanjog Sharma, Dubai and Bengaluru',
  arti: 'obstetrics & gynaecology care by Dr. Arti Sharma, Bengaluru',
}

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

// Strip accidental ```json / ``` fences if the pasted text still has them.
function stripFences(text) {
  return text.trim().replace(/^```(?:json)?\n/, '').replace(/\n```$/, '').trim()
}

// ── Route: import a Claude-authored post as JSON ────────────
// Body shape: { site, cover, body: [body0, body1], post: {...} }
// `post` is exactly what the Claude Project produced — see
// studio/claude-project-prompt.md for the schema.
async function handleImport(req, res) {
  let payload
  try {
    payload = JSON.parse(stripFences((await readBody(req)).toString()))
  } catch {
    return sendJSON(res, 400, { ok: false, error: 'That request body was not valid JSON.' })
  }

  try {
    const { site = 'sanjog', cover = null, body: bodyImages = [null, null], post } = payload
    const profile = resolveProfile(site)

    if (!post || typeof post !== 'object') throw new Error('Missing "post" — paste the JSON Claude gave you into the box first.')
    const {
      title, seoTitle, description, targetKeyword, keywords, tags,
      procedureName, procedureAlt, procedureBodyLocation, procedurePrep, procedureHow, procedureFollowup,
      howToName, howToSteps, faqs, body: articleBody,
    } = post

    if (!title) throw new Error('The pasted post has no "title".')
    if (!description) throw new Error('The pasted post has no "description".')
    if (!articleBody) throw new Error('The pasted post has no "body".')
    if (!Array.isArray(faqs) || !faqs.length) throw new Error('The pasted post has no "faqs".')

    if (!cover) throw new Error('Upload a cover photo before importing.')
    if (!bodyImages[0] || !bodyImages[1]) throw new Error('Upload both body photos before importing.')
    for (const p of [cover, bodyImages[0], bodyImages[1]]) {
      if (!existsSync(join(ROOT_DIR, 'public' + p))) throw new Error(`Uploaded image missing on disk: ${p}`)
    }

    let articleMdx = articleBody
      .replace(/\{\{BODY_IMAGE_1\}\}/g, bodyImages[0])
      .replace(/\{\{BODY_IMAGE_2\}\}/g, bodyImages[1])
    if (articleMdx.includes('{{')) {
      throw new Error('The pasted body still has an unresolved {{…}} placeholder — it must use exactly {{BODY_IMAGE_1}} and {{BODY_IMAGE_2}}.')
    }

    const coverAlt = `Clinical reference image for ${procedureName || title} — ${COVER_ALT_SUFFIX_BY_SITE[profile.key] || COVER_ALT_SUFFIX_BY_SITE.sanjog}`.replace(/"/g, "'")

    const frontmatter = {
      title,
      ...(seoTitle ? { seoTitle } : {}),
      description,
      date: todayISO(),
      ...(targetKeyword ? { targetKeyword } : {}),
      ...(Array.isArray(keywords) && keywords.length ? { keywords } : {}),
      author: AUTHOR_BY_SITE[profile.key] || AUTHOR_BY_SITE.sanjog,
      ...(Array.isArray(tags) && tags.length ? { tags } : {}),
      coverImage: cover,
      coverImageAlt: coverAlt,
      ...(procedureName ? { procedureName } : {}),
      ...(procedureAlt ? { procedureAlt } : {}),
      ...(procedureBodyLocation ? { procedureBodyLocation } : {}),
      ...(procedurePrep ? { procedurePrep } : {}),
      ...(procedureHow ? { procedureHow } : {}),
      ...(procedureFollowup ? { procedureFollowup } : {}),
      ...(howToName ? { howToName } : {}),
      ...(Array.isArray(howToSteps) && howToSteps.length ? { howToSteps } : {}),
      faqs,
    }

    const fm = yaml.dump(frontmatter, { lineWidth: -1, noRefs: true })
    const mdx = `---\n${fm}---\n\n${articleMdx.trim()}\n`

    const slug = slugify(title)
    const exists = existsSync(join(profile.postsDir, `${slug}.mdx`))

    sendJSON(res, 200, {
      ok: true, mdx, slug, title, exists,
      coverUrl: cover,
      liveUrl: `${profile.siteUrl}/blog/${slug}`,
    })
  } catch (e) {
    sendJSON(res, 400, { ok: false, error: e.message })
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

// Delete studio-uploaded images that nothing references.
//
// "Nothing" has to be judged across both branches. Each site's posts live on
// its own branch, so scanning only the checked-out working tree cannot see the
// other site's posts — it deleted images belonging to live posts on the branch
// that happened not to be checked out.
//
// Anything git tracks is therefore off limits: a tracked image belongs to a
// published post. Deleting one leaves that post pointing at a missing file, and
// leaves a tracked deletion behind that blocks the next cross-branch publish.
async function cleanupOrphanUploads(keepPaths) {
  const keep = new Set(keepPaths.map(p => p.replace('/images/blog/', '')))

  for (const ref of Object.values(SITE_PROFILES).map(p => p.gitBranch)) {
    const tree = await run('git', ['ls-tree', '-r', '--name-only', ref, 'public/images/blog/'])
    if (tree.code !== 0) continue
    for (const line of tree.out.split('\n')) {
      const name = line.trim().split('/').pop()
      if (name) keep.add(name)
    }
  }

  // Also spare anything an on-disk draft still points at, published or not.
  for (const dir of Object.values(SITE_PROFILES).map(p => p.postsDir)) {
    if (!existsSync(dir)) continue
    for (const f of readdirSync(dir)) {
      if (!f.endsWith('.mdx')) continue
      const text = readFileSync(join(dir, f), 'utf8')
      for (const m of text.matchAll(/\/images\/blog\/[A-Za-z0-9._-]+/g)) {
        keep.add(m[0].replace('/images/blog/', ''))
      }
    }
  }
  for (const f of readdirSync(IMAGES_DIR)) {
    if (f.startsWith('studio-') && !keep.has(f)) {
      try { unlinkSync(join(IMAGES_DIR, f)) } catch {}
    }
  }
}

// Each site's content lives on a different branch (main for Sanjog,
// multi-site for Arti). Only one branch can be checked out on disk at a
// time, so before writing a post we make sure we're on the right one.
//
// Only *tracked* modifications block the switch. Untracked files must not:
// the images for the post being published are themselves untracked at this
// point (they were just uploaded into public/images/blog), so blocking on
// them would make every cross-branch publish fail. Git carries untracked
// files across a checkout untouched, and if one would be clobbered by the
// target branch, checkout fails loudly and we surface that below.
async function ensureOnBranch(targetBranch) {
  const cur = await run('git', ['branch', '--show-current'])
  const currentBranch = cur.out.trim()
  if (currentBranch === targetBranch) return { switched: false, from: currentBranch }

  const status = await run('git', ['status', '--porcelain'])
  const trackedChanges = status.out
    .split('\n')
    .filter(l => l.trim() && !l.startsWith('??'))
  if (trackedChanges.length) {
    throw new Error(
      `Local repo is on branch "${currentBranch}" with uncommitted changes to tracked files, but this post belongs on "${targetBranch}". ` +
      `Commit or stash those changes first, then try publishing again.\n` +
      trackedChanges.join('\n')
    )
  }

  const checkout = await run('git', ['checkout', targetBranch])
  if (checkout.code !== 0) {
    throw new Error(`Could not switch to branch "${targetBranch}": ${(checkout.err || checkout.out).trim()}`)
  }
  return { switched: true, from: currentBranch }
}

async function handlePublish(req, res) {
  let branchSwitch = null
  try {
    const { mdx, slug, site = 'sanjog' } = JSON.parse((await readBody(req)).toString() || '{}')
    if (!mdx || !slug) return sendJSON(res, 400, { ok: false, error: 'Missing mdx or slug' })
    const profile = resolveProfile(site)

    branchSwitch = await ensureOnBranch(profile.gitBranch)

    const outPath = join(profile.postsDir, `${slug}.mdx`)
    // Re-publishing an existing slug is an edit → stamp dateModified with today
    // (keeps the original datePublished). A brand-new post may have been
    // imported days before it's actually published, so its date is forced to
    // today here rather than trusting whatever the import step wrote.
    const isEdit = existsSync(outPath)
    const today = todayISO()
    let finalMdx = isEdit
      ? upsertDateModified(mdx.trim(), today)
      : forceDate(mdx.trim(), today)
    finalMdx += '\n'
    writeFileSync(outPath, finalMdx, 'utf8')

    // Which local images does this post reference?
    const imgRefs = [...new Set((finalMdx.match(/\/images\/blog\/[A-Za-z0-9._-]+/g) || []))]
    await cleanupOrphanUploads(imgRefs)

    const liveUrl = `${profile.siteUrl}/blog/${slug}`
    writeFileSync(join(ROOT_DIR, '.last-published-url'), liveUrl, 'utf8')

    // git add (post + only the referenced images), commit, push
    const toAdd = [`${profile.postsDirRel}/${slug}.mdx`, ...imgRefs.map(p => 'public' + p)]
    for (const p of imgRefs.map(r => join(ROOT_DIR, 'public' + r))) {
      if (!existsSync(p)) throw new Error(`Publish aborted: referenced image is missing on disk: ${p}`)
    }
    const add = await run('git', ['add', ...toAdd])
    if (add.code !== 0) {
      return sendJSON(res, 500, { ok: false, error: 'git add failed', detail: (add.err || add.out).trim() })
    }
    const commit = await run('git', ['commit', '-m', `studio: publish ${slug} (${profile.key})`])
    if (commit.code !== 0) {
      return sendJSON(res, 500, { ok: false, error: 'git commit failed', detail: (commit.err || commit.out).trim() })
    }
    const push = await run('git', ['push', 'origin', profile.gitBranch])
    if (push.code !== 0) {
      return sendJSON(res, 500, {
        ok: false, error: 'git push failed', detail: (push.err || push.out).trim(),
      })
    }

    // Ping indexing (non-fatal)
    const ping = await run('node', ['scripts/ping-indexing.mjs'], { env: process.env })

    // Best-effort: restore whatever branch was checked out before publishing.
    if (branchSwitch?.switched) await run('git', ['checkout', branchSwitch.from])

    sendJSON(res, 200, {
      ok: true,
      liveUrl,
      committed: /publish/.test(commit.out) || commit.code === 0,
      git: (commit.out + push.out).trim(),
      ping: (ping.out || ping.err).trim(),
    })
  } catch (e) {
    if (branchSwitch?.switched) await run('git', ['checkout', branchSwitch.from]).catch(() => {})
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
    if (req.method === 'POST' && req.url === '/api/upload') {
      const { dataUrl, filename } = JSON.parse((await readBody(req)).toString() || '{}')
      return sendJSON(res, 200, { path: saveUpload(dataUrl, filename) })
    }
    if (req.method === 'POST' && req.url === '/api/import') {
      return handleImport(req, res)
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
  console.log(`  No API keys needed — paste a post as JSON from your Claude Project, then review and publish.\n`)
  // Best-effort: open the browser (macOS)
  spawn('open', [url]).on('error', () => {})
})
