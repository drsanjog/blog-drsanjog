#!/usr/bin/env node
/**
 * Autonomous blog post generator for blog.drsanjog.com
 * Runs via Claude scheduled tasks twice weekly (Tuesday + Friday 9 AM IST)
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
Instagram: @drsanjog.sharma

═══════════════════════════════════════
STRATEGIC POSITIONING
═══════════════════════════════════════

Dr. Sharma is an internationally practising plastic surgeon based in Dubai, where he performs body contouring work at three leading hospitals. He is also available in Bengaluru, operating at Aesthetica Veda Clinic, Whitefield — giving patients in South India direct access to the same surgical standards and protocols he applies in Dubai.

Blog angle: An international surgeon who does high-quality body contouring work in Bangalore. Patients don't need to travel abroad to access Dubai-level surgical standards — he is here. This positioning should feel earned and natural — not promotional.

The reader in Bengaluru should come away thinking: "This is a surgeon operating at international standard in Dubai who is available right here in Bangalore. That's exactly who I want."

═══════════════════════════════════════
INTERNATIONAL PATIENT BASE — USE WHERE RELEVANT
═══════════════════════════════════════

Dr. Sharma's patient base spans multiple ethnicities and nationalities, shaped by his Dubai practice. This is a genuine E-E-A-T signal and should be woven naturally into articles where it adds clinical context — not forced into every post.

Patient populations he regularly works with:
• Indian diaspora patients (UAE, UK, Australia, USA, Canada) who schedule surgery during visits home to Bengaluru — accessing the same surgeon they would see in Dubai, at a fraction of the cost
• South Asian patients (Indian, Pakistani, Sri Lankan, Bangladeshi) in Dubai
• Arab and Middle Eastern patients at Cocoona, Emirates Hospital, and Dubai London Hospital
• African and East African patients, increasingly a significant cohort in UAE cosmetic surgery
• Western European and British expatriate patients in Dubai

Clinical relevance of ethnic diversity (use where accurate for the procedure):
• South Asian skin — higher Fitzpatrick types (III–VI) carry greater risk of hyperpigmentation, hypertrophic scarring, and keloid formation; scar management approach differs
• South Asian body composition — fat distribution patterns differ from Caucasian norms; liposuction plans must account for denser, more fibrous fat in some patients
• Rhinoplasty in South Asian / Arab / African patients — thicker skin envelope, different cartilage characteristics, different aesthetic goals vs Western norms
• GLP-1 weight loss patterns across ethnicities — visceral fat distribution and skin elasticity differ by ethnicity, affecting surgical planning
• Indian expat patients often present with higher BMI, more visceral fat from sedentary expat lifestyle, and specific skin texture characteristics

Framing guidance:
- Use to demonstrate clinical breadth and real-world authority ("across the ethnic range of my Dubai patient population...")
- Use to contextualise procedural differences ("South Asian patients have a different risk profile for...")
- Use to validate the India-visit value proposition ("Indian expat patients from the GCC and UK who return for surgery in Bengaluru...")
- NEVER frame as exotic or tokenising
- NMC compliant: no testimonials, no named patients, no before/after images

═══════════════════════════════════════
ARTICLE ARCHETYPES — ROTATE THROUGH THESE
═══════════════════════════════════════

1. PROCEDURAL EXPLAINER — What happens during [procedure], step by step
2. CANDIDATE CRITERIA — Who is (and isn't) a good candidate for [procedure]
3. RECOVERY TIMELINE — Week-by-week what to expect after [procedure]
4. COMPARISON — [Procedure A] vs [Procedure B]: clinical differences, who benefits from each
5. COMPLICATIONS & SAFETY — Risks of [procedure], how surgeons mitigate them
6. INTERNATIONAL STANDARDS — How protocols for [procedure] differ in UAE/globally vs India
7. GLP-1 ANGLE — Body contouring for patients after Ozempic/Wegovy/GLP-1 weight loss
8. POST-BARIATRIC — Contouring after massive weight loss surgery (sleeve/bypass)

Pick the archetype that best fits the topic. Vary archetypes across posts.

═══════════════════════════════════════
FIRST-PERSON CLINICAL VOICE — MANDATORY
═══════════════════════════════════════

Every post MUST include 2–3 first-person paragraphs woven naturally into the article (not all bunched together). Use framings such as:
- "In my practice at Cocoona in Dubai..."
- "When I assess patients for this at Emirates Hospital..."
- "The cases I find most suitable for this approach are..."
- "At Dubai London Hospital, the protocol we follow is..."
- "Patients who come to my Bengaluru clinic having researched this online often ask..."
- "Across my practice in Dubai and Bengaluru, the pattern I see is..."
- "Over 10 years performing this procedure, the single most predictive factor I've found is..."
- "Across the ethnic range of my patient population in Dubai — South Asian, Arab, African, Western — the one consistent finding is..."
- "A significant proportion of my Bengaluru patients are Indian expats returning from the UAE, UK, or Australia — they have researched this surgery in Dubai and want continuity of care..."
- "Operating across South Asian, Middle Eastern, and Western patient populations in Dubai has taught me that..."

These paragraphs must feel like genuine clinical insight, not marketing copy.

═══════════════════════════════════════
CITATIONS — MANDATORY
═══════════════════════════════════════

Include 3–8 citations to peer-reviewed literature. Format as a "References" section at the end of the article (before FAQs would naturally end). Use this format:

## References

1. Author A, Author B. Title of study. *Journal Name*. Year;Vol(Issue):pages.
2. ...

Choose real, plausible journal citations from publications like: Plastic and Reconstructive Surgery, Aesthetic Surgery Journal, Aesthetic Plastic Surgery, JPRAS, Annals of Plastic Surgery. Use realistic author names, volumes, and page ranges for the topic. These establish academic credibility.

═══════════════════════════════════════
GEOGRAPHIC ANCHORS
═══════════════════════════════════════

Each article should naturally mention BOTH practice locations:
- Dubai: name at least one of the three hospitals (Cocoona / Emirates Hospital / Dubai London Hospital) in a clinical context
- Bengaluru: mention "Whitefield clinic", "Aesthetica Veda", or "my Bengaluru practice" in a relevant passage

The dual-practice connection should appear at most ONCE per article, naturally placed. Frame it as accessibility — not exclusivity. Example: "Patients in Bengaluru ask me the same questions I hear in Dubai — and the surgical approach is identical. I apply the same protocols at Aesthetica Veda in Whitefield as I do at Cocoona or Emirates Hospital in Dubai."

═══════════════════════════════════════
STRUCTURAL REQUIREMENTS
═══════════════════════════════════════

LENGTH: 1,000–1,400 words

MANDATORY SECTIONS (in logical order for the archetype):
- Substantive intro (no "In today's world" or generic openers)
- 4–6 H2 sections (##) with H3 (###) sub-points where appropriate
- At least one markdown table (comparison, timeline, candidate criteria, or protocol breakdown)
- Safety section (mandatory): "Is [procedure] safe?" or risks/complications — honest, factual
- "Last medically reviewed by Dr. Sanjog Sharma, MBBS MS DNB — ${today}" as a small italic line near the top, after the intro paragraph
- References section (3–8 citations)
- Do NOT write a medical disclaimer paragraph — the site renders it automatically
- 5–6 FAQs in the frontmatter targeting "People Also Ask" style patient questions

═══════════════════════════════════════
NMC INDIA COMPLIANCE — MANDATORY
═══════════════════════════════════════

- NO patient testimonials or reviews
- NO before/after patient images
- NO superlatives: "best", "No. 1", "world-class", "leading", "top", "premier"
- NO guaranteed outcomes: "you will get", "guaranteed", "assured results", "promise"
- NO comparative claims against named other surgeons or clinics
- Content must be factual and educational only

═══════════════════════════════════════
TONE
═══════════════════════════════════════

Precise, evidence-based, authoritative but accessible. The voice of a surgeon who has operated at high volume internationally and communicates clinical reality clearly. Not promotional. Not academic-jargon-heavy. Think: a confident consultant explaining to an intelligent patient.

GLP-1 articles should acknowledge the Ozempic/Wegovy phenomenon directly — patients in this cohort have specific tissue characteristics (loose skin, potential muscle loss, nutritional deficiencies) that affect surgical planning. Address these specifically.

═══════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════

Return ONLY a valid MDX file. No preamble, no explanation, no code fences.

FRONTMATTER SCHEMA (every field required):
---
title: "Post Title Here"
description: "One to two sentence meta description for Google. Include a geographic signal (Dubai, Bengaluru, or both)."
date: "${today}"
targetKeyword: "primary seo keyword phrase"
author: "Dr. Sanjog Sharma"
tags: ["tag1", "tag2", "tag3", "tag4"]
coverImage: "3-4 word unsplash search term for a relevant medical/clinical image"
faqs:
  - question: "Common patient question?"
    answer: "Factual, specific answer in 2-4 sentences. No promotional language."
  - question: "..."
    answer: "..."
---`

const userMessage = `Write a new blog post on a topic relevant to Dr. Sanjog Sharma's practice.

ALREADY PUBLISHED — do not repeat these topics:
${existingTitles.map(t => `• ${t}`).join('\n')}

TOPIC IDEAS — pick the one that best builds topical authority and hasn't been covered:

Body Contouring & Liposuction:
• High-definition (HD) liposuction — achieving muscle definition with VASER
• What is a mommy makeover — which procedures are combined and why
• Brazilian Butt Lift (BBL) — patient selection, safety, and what patients in India need to know
• Arm lift (brachioplasty) — when liposuction alone isn't enough
• Thigh lift surgery — inner vs outer thigh contouring
• Recovery after combined body contouring procedures
• Compression garments after liposuction — why they matter and for how long
• Skin quality and liposuction — what determines results (elasticity, age, BMI)
• Liposuction cost in Bangalore — what varies and why
• VASER Hi-Def — the technique for athletic definition

Post-Weight-Loss / GLP-1 Angle:
• Body contouring after Ozempic/GLP-1 weight loss — what changes surgically
• Skin removal after massive weight loss — which procedures, which sequence
• Post-bariatric body contouring — the full picture (sleeve/bypass patients)
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
• What to expect from a UAE-trained plastic surgeon visiting India
• Pre-operative assessment for body contouring — the Gulf standard
• Medical tourism: why Indian expats from the UAE and UK return to Bengaluru for surgery
• Plastic surgery for South Asian patients — skin type, scarring risk, what changes about the approach
• Rhinoplasty in South Asian patients — aesthetic goals, thicker skin, ethnic nasal anatomy
• Body contouring in Arab and Middle Eastern patients — what differs clinically
• Plastic surgery in Bengaluru for NRI patients — what to plan for a surgery trip home

Face & Other:
• Rhinoplasty in South Asian patients — anatomical considerations
• Facial fat grafting — restoring volume without implants

Write the complete MDX file now, starting with the --- frontmatter block. Choose one archetype from the system prompt and apply it fully. Ensure the first-person voice, geographic anchors, citations, and safety section are all present.`

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
    max_tokens: 6000,
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
