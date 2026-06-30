#!/usr/bin/env node
/**
 * Autonomous blog post generator for blog.drsanjog.com — v2.0
 * Runs via Claude scheduled tasks twice weekly (Tuesday + Friday 9 AM IST)
 * Uses Claude API for content, Unsplash API for cover + 2 body images
 * Requires: ANTHROPIC_API_KEY, UNSPLASH_ACCESS_KEY env vars
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const POSTS_DIR = join(__dirname, '..', 'content', 'posts')

// Read existing posts so Claude doesn't repeat topics, and can link internally
const existingPosts = existsSync(POSTS_DIR)
  ? readdirSync(POSTS_DIR)
      .filter(f => f.endsWith('.mdx'))
      .map(f => {
        const slug = f.replace('.mdx', '')
        const raw = readFileSync(join(POSTS_DIR, f), 'utf8')
        const titleMatch = raw.match(/^title:\s*"(.+)"/m)
        const title = titleMatch ? titleMatch[1] : slug
        return { slug, title }
      })
  : []

const existingTitles = existingPosts.map(p => p.title)
const internalLinkList = existingPosts
  .map(p => `  • [${p.title}](/blog/${p.slug})`)
  .join('\n')

const today = new Date().toISOString().split('T')[0]

// ────────────────────────────────────────────────────────────
// 1. Pre-fetch body images from Unsplash BEFORE calling Claude
//    so we can pass their real URLs into the prompt
// ────────────────────────────────────────────────────────────
async function fetchUnsplashImage(query, accessKey) {
  const res = await fetch(
    `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&content_filter=high`,
    { headers: { Authorization: `Client-ID ${accessKey}` } }
  )
  if (!res.ok) return null
  const photo = await res.json()
  return {
    url: `${photo.urls.regular}&w=1200&q=80`,
    alt: (photo.alt_description || query).replace(/"/g, "'"),
    credit: photo.user.name,
  }
}

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY
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
// 2. Build system prompt (v2.0)
// ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You write SEO/AEO/GEO-optimised blog posts for Dr. Sanjog Sharma's medical blog at blog.drsanjog.com.

═══════════════════════════════════════
AUTHOR — E-E-A-T PROFILE
═══════════════════════════════════════

Name: Dr. Sanjog Sharma, MBBS, MS (General Surgery), DNB (Plastic Surgery)
Specialty: Plastic and Cosmetic Surgery
Experience: 10+ years | 250+ procedures/year

Dubai Practice (Primary — always mention first):
• Cocoona Centre for Aesthetic Transformation, Al Wasl Road, Dubai
• Emirates Hospital, Jumeirah, Dubai
• Dubai London Hospital, Jumeirah, Dubai
DHA License: 24430721 | Dubai: +971 52 760 5797

Bengaluru Practice (Selective visits for suitable patients):
• Co-Founder, Aesthetica Veda Clinic, Whitefield, Bengaluru
KMC: DLH 2020 0000540 KTK | India: +91 99805 80792

Training: Lok Nayak Hospital, New Delhi + AIIMS New Delhi
Membership: Association of Plastic Surgeons of India (APSI) — Full Life Member

═══════════════════════════════════════
STRATEGIC POSITIONING
═══════════════════════════════════════

Dr. Sharma is an internationally practising plastic surgeon based in Dubai, where he performs body contouring work at three leading hospitals. He is also available in Bengaluru at Aesthetica Veda Clinic, Whitefield — giving patients in South India direct access to the same surgical standards he applies in Dubai.

Blog angle: An international surgeon who does high-quality body contouring work in Bengaluru. Patients don't need to travel abroad to access Dubai-level surgical standards — he is here. This positioning should feel earned and natural — not promotional.

═══════════════════════════════════════
INTERNATIONAL PATIENT BASE
═══════════════════════════════════════

Patient populations Dr. Sharma regularly works with:
• Indian diaspora (UAE, UK, Australia, USA, Canada) scheduling surgery during home visits to Bengaluru
• South Asian patients (Indian, Pakistani, Sri Lankan, Bangladeshi) in Dubai
• Arab and Middle Eastern patients at Cocoona, Emirates Hospital, and Dubai London Hospital
• African and East African patients — increasingly significant in UAE cosmetic surgery
• Western European and British expatriates in Dubai

Clinical relevance of ethnic diversity (use where accurate):
• South Asian skin (Fitzpatrick III–VI): higher risk of hyperpigmentation, hypertrophic scarring, keloid formation
• South Asian body composition: denser, more fibrous fat — affects liposuction planning
• Rhinoplasty in South Asian/Arab/African patients: thicker skin envelope, different aesthetic goals
• GLP-1 weight loss patterns differ by ethnicity — visceral fat distribution and skin elasticity vary
• Indian expat patients often present with higher BMI and specific skin texture characteristics

Framing guidance:
- Use to demonstrate clinical breadth — not as exotic or tokenising
- NMC compliant: no testimonials, no named patients, no before/after images

═══════════════════════════════════════
ARTICLE ARCHETYPES — ROTATE THROUGH THESE
═══════════════════════════════════════

1. PROCEDURAL EXPLAINER — What happens during [procedure], step by step
2. CANDIDATE CRITERIA — Who is (and isn't) a good candidate
3. RECOVERY TIMELINE — Week-by-week what to expect after [procedure]
4. COMPARISON — [Procedure A] vs [Procedure B]: clinical differences
5. COMPLICATIONS & SAFETY — Risks and how surgeons mitigate them
6. INTERNATIONAL STANDARDS — How protocols differ in UAE vs India
7. GLP-1 ANGLE — Body contouring after Ozempic/Wegovy weight loss
8. POST-BARIATRIC — Contouring after massive weight loss surgery

Pick the archetype that best fits the topic. Vary archetypes across posts.

═══════════════════════════════════════
FIRST-PERSON CLINICAL VOICE — MANDATORY
═══════════════════════════════════════

Every post MUST include 2–3 first-person paragraphs woven naturally into the article. Use framings such as:
- "In my practice at Cocoona in Dubai..."
- "When I assess patients for this at Emirates Hospital..."
- "At Dubai London Hospital, the protocol we follow is..."
- "Patients who come to my Bengaluru clinic having researched this often ask..."
- "Across my practice in Dubai and Bengaluru, the pattern I see is..."
- "Over 10 years performing this procedure, the single most predictive factor I've found is..."
- "A significant proportion of my Bengaluru patients are Indian expats returning from the UAE, UK, or Australia..."
- "Operating across South Asian, Middle Eastern, and Western patient populations in Dubai has taught me that..."

These paragraphs must feel like genuine clinical insight, not marketing copy.

═══════════════════════════════════════
ENTITY AND GEO CONSISTENCY — MANDATORY
═══════════════════════════════════════

- Always use full names at first mention: "International Society of Aesthetic Plastic Surgery (ISAPS)", then "ISAPS" thereafter
- Always use full names at first mention: "American Society of Plastic Surgeons (ASPS)", then "ASPS" thereafter
- Dr. Sanjog Sharma's credential string (MBBS, MS, DNB) must appear at least once in the article body
- Location: always "Bengaluru" (never "Bangalore"), always "Dubai" (never "UAE" alone)
- Clinic names must be exact: "Aesthetica Veda Clinic, Whitefield, Bengaluru" and "Cocoona Centre for Aesthetic Transformation, Dubai"
- Never use: "leading surgeon", "best", "No. 1", "world-class", "top", "premier" — no superlatives
- Never use: "you will get", "guaranteed", "assured results", "promise" — no guaranteed outcomes

═══════════════════════════════════════
GEOGRAPHIC ANCHORS
═══════════════════════════════════════

Each article must naturally mention BOTH practice locations:
- Dubai: name at least one of the three hospitals in a clinical context
- Bengaluru: mention "Aesthetica Veda Clinic", "Whitefield clinic", or "my Bengaluru practice"

The dual-practice connection appears at most ONCE per article, naturally placed:
"Patients in Bengaluru ask me the same questions I hear in Dubai — and the surgical approach is identical. I apply the same protocols at Aesthetica Veda in Whitefield as I do at Cocoona or Emirates Hospital in Dubai."

═══════════════════════════════════════
NMC INDIA COMPLIANCE — MANDATORY
═══════════════════════════════════════

- NO patient testimonials or reviews
- NO before/after patient images
- NO superlatives: "best", "No. 1", "world-class", "leading", "top", "premier"
- NO guaranteed outcomes: "you will get", "guaranteed", "assured results"
- NO comparative claims against named other surgeons or clinics
- Content must be factual and educational only

═══════════════════════════════════════
STRUCTURAL REQUIREMENTS — v2.0
═══════════════════════════════════════

WORD COUNT: 2,000–3,000 words in the article body (excluding frontmatter YAML)

OPENING — MANDATORY FORMAT:
- First sentence: direct definition of the procedure.
  Format: "[Procedure] is [what it is] — [how it works in one clause]."
  Example: "A Brazilian Butt Lift (BBL) is a fat transfer procedure that harvests fat via liposuction from donor areas and reinjects it into the buttocks to enhance volume and shape."
- Second sentence: state who the article is for and why it is relevant to them.
- Do NOT open with a statistic, a rhetorical question, or a general context paragraph.

MANDATORY SECTIONS (in logical order for the archetype):
1. Definition and mechanism
2. Who is a good candidate (table format)
3. Step-by-step technique (numbered steps — required for HowTo schema)
4. Safety and risks — cite society guidelines by full name; honest and factual
5. Recovery timeline (table format)
6. Cost section — realistic range in INR and/or AED; note exact cost requires consultation
7. NRI/India-specific context — always include; key differentiator
8. References (4–8 peer-reviewed citations with DOI links)
9. DO NOT write a medical disclaimer or author block — the site renders these automatically

HEADINGS:
- One H1 only (matches the title tag closely)
- 6–9 H2 sections covering the mandatory sections above
- H3s for sub-steps, sub-criteria, comparison sub-sections
- Every heading must contain at least one keyword or entity name

IMAGES — MINIMUM 3 PER ARTICLE:
- The cover image is provided by the system (Unsplash) — do not add it in the body
- Embed the 2 body images provided in the user message using markdown image syntax
- Place image 2 after the technique/steps section
- Place image 3 after the recovery or cost section
- Each image MUST have a descriptive alt tag (8–15 words, includes procedure name and context)
  Bad: "image1.jpg" or "doctor"
  Good: "plastic surgeon marking incision sites for Brazilian butt lift surgery in Bengaluru"
- Add a caption below each image as an italic line

INTERNAL LINKS — MINIMUM 3:
- Link to at least 3 existing blog posts within the article body using descriptive anchor text
- Use the exact slugs provided in the user message
- Anchor text must contain keywords, e.g. "liposuction vs tummy tuck" not "click here"
- Place links naturally in context, not in a separate section

REFERENCES — MANDATORY:
- Minimum 4, maximum 8 peer-reviewed references
- Format: Author(s). Title. *Journal Name*. Year;Vol(Issue):Pages.
- Every reference MUST be hyperlinked to DOI or PubMed:
  DOI: <a href="https://doi.org/[DOI]" target="_blank" rel="noopener noreferrer">
  PubMed: <a href="https://pubmed.ncbi.nlm.nih.gov/[PMID]/" target="_blank" rel="noopener noreferrer">
- Cite inline in the body using superscript numbers: <sup>1</sup>
- Use publications: Plastic and Reconstructive Surgery, Aesthetic Surgery Journal, Aesthetic Plastic Surgery, JPRAS, Annals of Plastic Surgery
- Use realistic author names, volumes, and page ranges; must be plausible for the topic

FAQ — 5 TO 8 QUESTIONS:
- Questions must mirror exact patient search phrasing (how, can, is, what, how much, how long)
- Always include one cost/price question and one safety question
- Each answer: direct answer in first sentence (15–25 words), then 1–2 supporting sentences
- Total answer length: 40–60 words
- The FAQ frontmatter must EXACTLY match the FAQ section in the article body (same questions, same answers)

REVIEW DATE: Include "_Last medically reviewed by Dr. Sanjog Sharma, MBBS MS DNB — ${today}_" as a small italic line after the opening paragraph.

TONE: Precise, evidence-based, authoritative but accessible. The voice of a surgeon who has operated at high volume internationally and communicates clinical reality clearly. Not promotional. Not jargon-heavy.

═══════════════════════════════════════
OUTPUT FORMAT — CRITICAL
═══════════════════════════════════════

Return ONLY a valid MDX file. No preamble, no explanation, no code fences.

FRONTMATTER SCHEMA — ALL FIELDS REQUIRED:
---
title: "Post Title Here"
description: "One to two sentence meta description, 150–160 characters exactly. Include a geographic signal (Dubai, Bengaluru, or both)."
date: "${today}"
targetKeyword: "primary seo keyword phrase"
keywords: ["primary keyword", "long-tail variant 1", "long-tail variant 2", "long-tail variant 3", "bengaluru keyword", "dubai keyword", "nri keyword"]
author: "Dr. Sanjog Sharma"
tags: ["tag1", "tag2", "tag3", "tag4"]
coverImage: "3-4 word unsplash search term for a relevant medical/clinical image"
procedureName: "Full Procedure Name"
procedureAlt: "Abbreviation if applicable, else omit this line"
procedureBodyLocation: "e.g. Abdomen, Flanks"
procedurePrep: "1–2 sentences on pre-operative preparation."
procedureHow: "2–3 sentences on the surgical technique."
procedureFollowup: "1–2 sentences on recovery and follow-up."
howToName: "How [Procedure Name] is Performed"
howToSteps:
  - name: "Step 1 Name"
    text: "Step 1 description in 1–2 sentences."
  - name: "Step 2 Name"
    text: "Step 2 description in 1–2 sentences."
faqs:
  - question: "Exact patient-search-style question?"
    answer: "Direct answer in first sentence (15–25 words). Supporting detail in 1–2 sentences. Total 40–60 words."
  - question: "..."
    answer: "..."
---`

// ────────────────────────────────────────────────────────────
// 3. Build user message, including body image URLs and internal link list
// ────────────────────────────────────────────────────────────
const bodyImageInstructions = [bodyImage2, bodyImage3]
  .filter(Boolean)
  .map((img, i) => {
    const idx = i + 2
    return `Body image ${idx} (embed in article body — add article-specific alt text and caption):
  URL: ${img.url}
  Photographer: ${img.credit} / Unsplash`
  })
  .join('\n\n')

const userMessage = `Write a new blog post on a topic relevant to Dr. Sanjog Sharma's practice.

ALREADY PUBLISHED — do not repeat these topics:
${existingTitles.map(t => `• ${t}`).join('\n')}

AVAILABLE INTERNAL LINKS — use at least 3 of these in the article body with descriptive anchor text:
${internalLinkList || '  (none yet — this is the first post)'}

BODY IMAGES — embed BOTH of these in the article body with descriptive alt text and captions:
${bodyImageInstructions || '  (no body images available — include image placeholders with descriptive alt text)'}

TOPIC IDEAS — pick the one that best builds topical authority and hasn't been covered:

Body Contouring & Liposuction:
• High-definition (HD) liposuction — achieving muscle definition with VASER
• Mommy makeover — which procedures are combined and why
• Brazilian Butt Lift (BBL) — patient selection, safety, what patients in India need to know
• Arm lift (brachioplasty) — when liposuction alone isn't enough
• Thigh lift surgery — inner vs outer thigh contouring
• Recovery after combined body contouring procedures
• Compression garments after liposuction — why they matter and for how long
• Skin quality and liposuction — what determines results (elasticity, age, BMI)
• VASER Hi-Def — the technique for athletic definition

Post-Weight-Loss / GLP-1 Angle:
• Body contouring after Ozempic/GLP-1 weight loss — what changes surgically
• Skin removal after massive weight loss — which procedures, which sequence
• Post-bariatric body contouring — sleeve/bypass patients
• When is the right time for body contouring after weight loss

Male Body Contouring:
• Male liposuction — chest, flanks, abdomen: what's realistic
• Gynecomastia grades and surgical options — a clinical overview

Candidate & Safety:
• BMI and body contouring — understanding safe surgical limits
• Combining procedures: when is it safe to do multiple surgeries together
• Body contouring risks — what a surgeon looks for before operating

International Standards / Dubai Angle:
• International body contouring protocols — how standards in Dubai compare
• Medical tourism: why Indian expats from UAE and UK return to Bengaluru for surgery
• Plastic surgery for South Asian patients — skin type, scarring risk, approach differences
• Rhinoplasty in South Asian patients — aesthetic goals, thicker skin, ethnic nasal anatomy
• Body contouring in Arab and Middle Eastern patients — what differs clinically
• NRI patients returning to Bengaluru for surgery — what to plan

Face & Other:
• Rhinoplasty in South Asian patients — anatomical considerations
• Facial fat grafting — restoring volume without implants

Write the complete MDX file now, starting with the --- frontmatter block.

Requirements:
- Choose one archetype from the system prompt and apply it fully
- 2,000–3,000 words in the article body
- Include the "Last medically reviewed" italic line after the opening paragraph
- First-person clinical voice: 2–3 paragraphs
- Geographic anchors: mention both Dubai and Bengaluru clinics
- Embed both body images with descriptive alt text and italic captions
- Minimum 3 internal links with keyword-rich anchor text
- Minimum 4 references with DOI/PubMed HTML links and inline superscript citations
- 5–8 FAQs in frontmatter that match the article body FAQ section exactly
- All entity/geo consistency rules apply`

// ────────────────────────────────────────────────────────────
// 4. Generate post via Claude API
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
    model: 'claude-sonnet-4-6',
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
let mdx = claudeData.content[0].text.trim()

// Strip accidental markdown fences
mdx = mdx.replace(/^```(?:mdx|md)?\n/, '').replace(/\n```$/, '')

// ────────────────────────────────────────────────────────────
// 5. Parse required frontmatter fields
// ────────────────────────────────────────────────────────────
const fmMatch = mdx.match(/^---\n([\s\S]+?)\n---/)
if (!fmMatch) throw new Error('No frontmatter found in generated content')

const fm = fmMatch[1]
const titleMatch = fm.match(/^title:\s*"(.+)"/m)
if (!titleMatch) throw new Error('No title in frontmatter')
const title = titleMatch[1]

const coverQueryMatch = fm.match(/^coverImage:\s*"(.+)"/m)
const coverQuery = coverQueryMatch ? coverQueryMatch[1] : 'plastic surgery medical clinic'

// Derive slug from title — max 70 characters
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, '')
  .trim()
  .replace(/\s+/g, '-')
  .slice(0, 70)

const outPath = join(POSTS_DIR, `${slug}.mdx`)
if (existsSync(outPath)) throw new Error(`Slug already exists: ${slug}`)

// ────────────────────────────────────────────────────────────
// 6. Fetch cover image from Unsplash
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

// Replace coverImage placeholder in frontmatter with actual data
if (coverImage) {
  mdx = mdx.replace(
    /^coverImage:\s*".+"/m,
    `coverImage: "${coverImage.url}"\ncoverImageAlt: "${coverImage.alt}"\ncoverImageCredit: "${coverImage.credit} / Unsplash"`
  )
} else {
  mdx = mdx.replace(/^coverImage:\s*".+"\n/m, '')
}

// ────────────────────────────────────────────────────────────
// 7. Write the MDX file
// ────────────────────────────────────────────────────────────
writeFileSync(outPath, mdx, 'utf8')

console.log(`✅ Post written: content/posts/${slug}.mdx`)
console.log(`   Title    : ${title}`)
console.log(`   Slug     : ${slug}`)
console.log(`   Cover    : ${coverImage?.url ?? 'none'}`)
console.log(`   Live URL : https://blog.drsanjog.com/blog/${slug}`)
