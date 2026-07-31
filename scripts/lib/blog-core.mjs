/**
 * Shared blog-generation core for blog.drsanjog.com
 * Used by BOTH:
 *   • scripts/generate-post.mjs  (autonomous scheduled task)
 *   • studio/server.mjs          (local Blog Studio app)
 *
 * Single source of truth for the prompt, Unsplash fetching, slug/date handling.
 */

import { readFileSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const ROOT_DIR = join(__dirname, '..', '..')
export const POSTS_DIR = join(ROOT_DIR, 'content', 'posts')
export const PUBLIC_DIR = join(ROOT_DIR, 'public')
export const IMAGES_DIR = join(PUBLIC_DIR, 'images', 'blog')
const ARTI_POSTS_DIR = join(ROOT_DIR, 'content', 'arti', 'posts')

// Same model the scheduled task uses — keep in sync in one place.
export const MODEL = 'claude-sonnet-4-6'

export const todayISO = () => new Date().toISOString().split('T')[0]

// ────────────────────────────────────────────────────────────
// Multi-site profiles — Blog Studio's "site" selector reads from this.
// generate-post.mjs (the autonomous scheduled task) never passes a `site`
// argument, so every function below defaults to 'sanjog' and behaves
// exactly as before this was added.
// ────────────────────────────────────────────────────────────
export const SITE_PROFILES = {
  sanjog: {
    key: 'sanjog',
    label: 'Dr. Sanjog Sharma — blog.drsanjog.com',
    postsDir: POSTS_DIR,
    postsDirRel: 'content/posts',
    siteUrl: 'https://blog.drsanjog.com',
    gitBranch: 'main',
    fallbackCoverQuery: 'plastic surgery medical clinic',
    fallbackBodyQueries: ['surgical consultation clinic patient', 'medical recovery hospital bed'],
  },
  arti: {
    key: 'arti',
    label: 'Dr. Arti Sharma — blog.drarti.in',
    postsDir: ARTI_POSTS_DIR,
    postsDirRel: 'content/arti/posts',
    siteUrl: 'https://blog.drarti.in',
    gitBranch: 'multi-site',
    fallbackCoverQuery: 'gynaecologist doctor consultation clinic',
    fallbackBodyQueries: ['woman doctor patient consultation clinic', 'healthy lifestyle woman wellness'],
  },
}

export function resolveProfile(site) {
  return SITE_PROFILES[site] || SITE_PROFILES.sanjog
}

// ────────────────────────────────────────────────────────────
// Existing posts — so Claude doesn't repeat topics and can link internally
// ────────────────────────────────────────────────────────────
export function getExistingPosts(postsDir = POSTS_DIR) {
  const posts = existsSync(postsDir)
    ? readdirSync(postsDir)
        .filter(f => f.endsWith('.mdx'))
        .map(f => {
          const slug = f.replace('.mdx', '')
          const raw = readFileSync(join(postsDir, f), 'utf8')
          const titleMatch = raw.match(/^title:\s*"(.+)"/m)
          const title = titleMatch ? titleMatch[1] : slug
          return { slug, title }
        })
    : []

  const existingTitles = posts.map(p => p.title)
  const internalLinkList = posts
    .map(p => `  • [${p.title}](/blog/${p.slug})`)
    .join('\n')

  return { posts, existingTitles, internalLinkList }
}

// ────────────────────────────────────────────────────────────
// Unsplash
// ────────────────────────────────────────────────────────────
export async function fetchUnsplashImage(query, accessKey) {
  if (!accessKey) return null
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

// ────────────────────────────────────────────────────────────
// Slug / date / frontmatter helpers
// ────────────────────────────────────────────────────────────
export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 70)
}

// Strip accidental ```mdx / ``` fences from a model response
export function stripFences(mdx) {
  return mdx.replace(/^```(?:mdx|md)?\n/, '').replace(/\n```$/, '').trim()
}

// Force the frontmatter date to `today` — the model sometimes copies a stale
// example date, so we overwrite it deterministically. (Fixes the date drift bug.)
export function forceDate(mdx, today = todayISO()) {
  if (/^date:\s*".*"/m.test(mdx)) {
    return mdx.replace(/^date:\s*".*"/m, `date: "${today}"`)
  }
  // No date line — inject one right after the title line inside frontmatter.
  return mdx.replace(/^(title:.*)$/m, `$1\ndate: "${today}"`)
}

// Set/replace the dateModified frontmatter field (used when editing an existing
// post) — powers the "Last updated" line and schema/sitemap dateModified.
export function upsertDateModified(mdx, date = todayISO()) {
  if (/^dateModified:\s*".*"/m.test(mdx)) {
    return mdx.replace(/^dateModified:\s*".*"/m, `dateModified: "${date}"`)
  }
  return mdx.replace(/^(date:\s*".*")$/m, `$1\ndateModified: "${date}"`)
}

export function parseTitle(mdx) {
  const m = mdx.match(/^title:\s*"(.+)"/m)
  return m ? m[1] : null
}

export function parseCoverQuery(mdx, fallback = 'plastic surgery medical clinic') {
  const m = mdx.match(/^coverImage:\s*"(.+)"/m)
  return m ? m[1] : fallback
}

// Build a descriptive, procedure-relevant cover alt from the post itself —
// never reuse a generic stock-photo caption ("person in blue shirt holding paper").
export function deriveCoverAlt(mdx, site = 'sanjog') {
  const isArti = site === 'arti'
  const title = parseTitle(mdx) || (isArti ? 'gynaecology consultation' : 'body contouring procedure')
  const proc = (mdx.match(/^procedureName:\s*"(.+)"/m) || [])[1]
  const subject = proc || title
  const suffix = isArti
    ? '— obstetrics & gynaecology care by Dr. Arti Sharma, Bengaluru'
    : '— plastic surgery by Dr. Sanjog Sharma, Dubai and Bengaluru'
  return `Clinical reference image for ${subject} ${suffix}`.replace(/"/g, "'")
}

/**
 * Resolve the cover image in the frontmatter.
 * `cover` may be:
 *   { url, alt, credit }  → written as coverImage/coverImageAlt/coverImageCredit
 *   null                  → coverImage line removed
 */
export function applyCover(mdx, cover) {
  if (cover && cover.url) {
    const creditLine = cover.credit ? `\ncoverImageCredit: "${cover.credit}"` : ''
    return mdx.replace(
      /^coverImage:\s*".+"/m,
      `coverImage: "${cover.url}"\ncoverImageAlt: "${cover.alt || ''}"${creditLine}`
    )
  }
  return mdx.replace(/^coverImage:\s*".+"\n/m, '')
}

// ────────────────────────────────────────────────────────────
// Prompt construction
// ────────────────────────────────────────────────────────────
export function buildSystemPrompt(today = todayISO(), site = 'sanjog') {
  if (site === 'arti') return buildArtiSystemPrompt(today)
  return `You write SEO/AEO/GEO-optimised blog posts for Dr. Sanjog Sharma's medical blog at blog.drsanjog.com.

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
8. Key Points — a "## Key Points" H2 near the end (after cost/NRI, before References) with 4–6 concise bullet takeaways summarising the article
9. References (4–8 peer-reviewed citations with DOI links)
10. DO NOT write a medical disclaimer or author block — the site renders these automatically

CLOSING "KEY POINTS" BLOCK — MANDATORY:
- Include a "## Key Points" section with 4–6 single-line bullets that summarise the most important takeaways (candidacy, technique, recovery, cost, safety).
- Place it near the end of the article, after the cost/NRI sections and before the References section.
- Each bullet is one short factual sentence — no superlatives, no guarantees.

HEADINGS:
- One H1 only (matches the title tag closely)
- 6–9 H2 sections covering the mandatory sections above
- H3s for sub-steps, sub-criteria, comparison sub-sections
- Every heading must contain at least one keyword or entity name

IMAGES — MINIMUM 3 PER ARTICLE:
- The cover image is provided by the system — do not add it in the body
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
- For any body-contouring topic, also link once to the pillar guide at /blog/body-contouring using anchor text like "body contouring surgery guide"

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
title: "Full descriptive H1 title (up to ~70 characters is fine — this is the on-page heading)"
seoTitle: "Concise <title> tag — MAX 45 CHARACTERS, primary keyword or procedure only. Do NOT include the brand/author name; the site automatically appends ' | Dr. Sanjog Sharma'."
description: "Meta description, 150–160 characters and NEVER more than 160. Include the primary keyword, a clear reason to click, and a geographic signal (Dubai, Bengaluru, or both)."
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
}

function buildArtiSystemPrompt(today = todayISO()) {
  return `You write SEO/AEO/GEO-optimised blog posts for Dr. Arti Sharma's medical blog at blog.drarti.in.

═══════════════════════════════════════
AUTHOR — E-E-A-T PROFILE
═══════════════════════════════════════

Name: Dr. Arti Sharma, MBBS, DNB (Obstetrics & Gynaecology), Diploma in Cosmetic Gynaecology
Specialty: Obstetrics & Gynaecology, with a cosmetic gynaecology sub-practice
Registration: Karnataka Medical Council (KMC) Reg. No. 109317

Practice (Bengaluru):
• Cloudnine Hospital, Sarjapur Road, Bengaluru — obstetrics, delivery, general gynaecology
• Docube Clinic, Doddakannelli, Bengaluru — general gynaecology
• Aesthetica Veda, Koramangala, Bengaluru — cosmetic gynaecology
Bengaluru: +91 90196 38165 (main) | +91 97414 35255 (Aesthetica Veda / cosmetic gynaecology)

Training: MBBS — Kasturba Medical College, Manipal Academy of Higher Education; DNB (Obstetrics & Gynaecology) — National Board of Examinations, New Delhi; Cosmetic Gynaecology diploma — University Medicine Greifswald, Germany, with the Indo-German Board of Aesthetic Medicine & Surgery

═══════════════════════════════════════
STRATEGIC POSITIONING
═══════════════════════════════════════

Dr. Sharma is a Bengaluru-based obstetrician and gynaecologist whose practice spans the full span of women's health — antenatal care and delivery, routine gynaecology, and cosmetic gynaecology — all under one practitioner. Blog angle: an approachable, evidence-based resource that treats every stage of a woman's reproductive life as connected, from adolescence through pregnancy to menopause, delivered with the compassion her practice is known for locally. This positioning should feel earned and natural — never promotional.

═══════════════════════════════════════
ENTITY AND GEO CONSISTENCY — MANDATORY
═══════════════════════════════════════

- Always use full names at first mention: "Federation of Obstetric and Gynaecological Societies of India (FOGSI)", then "FOGSI" thereafter
- Dr. Arti Sharma's credential string ("MBBS, DNB (Obstetrics & Gynaecology)") must appear at least once in the article body
- Location: always "Bengaluru" (never "Bangalore")
- Clinic names must be exact: "Cloudnine Hospital, Sarjapur Road, Bengaluru"; "Docube Clinic, Doddakannelli, Bengaluru"; "Aesthetica Veda, Koramangala, Bengaluru" (cosmetic gynaecology only — do not attribute obstetric/general gynaecology topics to Aesthetica Veda)
- Never use: "leading", "best", "No. 1", "world-class", "top", "premier" — no superlatives
- Never use: "you will get", "guaranteed", "assured results", "promise" — no guaranteed outcomes

═══════════════════════════════════════
COMPLIANCE & TONE — MANDATORY
═══════════════════════════════════════

- NO patient testimonials or reviews
- NO before/after patient images (especially for cosmetic gynaecology topics)
- NO superlatives, NO guaranteed outcomes, NO comparative claims against named other doctors or clinics
- Content must be factual and educational only
- This is intimate, sensitive medical content. Every topic — including cosmetic gynaecology — must be written in a clinical, professional, tasteful register, exactly as a hospital patient-education leaflet would. Never sensationalise, never use explicit or suggestive language, never frame a topic for titillation. Discomfort is a medical symptom to be discussed plainly and respectfully, not euphemised or sensationalised.
- Where a topic concerns a minor's health (e.g. adolescent menstrual health), keep language age-appropriate and directed at a parent/guardian reader.

═══════════════════════════════════════
FIRST-PERSON CLINICAL VOICE — MANDATORY
═══════════════════════════════════════

Every post MUST include 2–3 first-person paragraphs woven naturally into the article. Use framings such as:
- "In my practice at Cloudnine Hospital, Sarjapur Road..."
- "When I assess patients for this at Docube Clinic..."
- "Patients who come to me at Aesthetica Veda for a cosmetic gynaecology consultation often ask..."
- "Across my obstetric and gynaecological practice in Bengaluru, the pattern I see is..."
- "Over the years managing this condition, the single most common misconception I encounter is..."

These paragraphs must feel like genuine clinical insight, not marketing copy.

═══════════════════════════════════════
ARTICLE ARCHETYPES — ROTATE THROUGH THESE
═══════════════════════════════════════

1. CONDITION EXPLAINER — what a condition is, why it happens, how it presents
2. SYMPTOM/DIAGNOSIS GUIDE — how a condition is diagnosed, what tests mean
3. TREATMENT OPTIONS — lifestyle, medical, and (where relevant) surgical management
4. WHEN TO SEE A DOCTOR — red-flag symptoms and appropriate urgency
5. PREGNANCY & POSTPARTUM — antenatal, delivery, and postpartum topics
6. PROCEDURAL EXPLAINER — for genuine procedures only (e.g. hymenoplasty, vaginal rejuvenation, MTP): what happens, step by step
7. MYTH VS FACT — common misconceptions about a condition or procedure, corrected with evidence
8. PATIENT EDUCATION / FAQ-DRIVEN — built around the most common questions patients ask about a topic

Pick the archetype that best fits the topic. Vary archetypes across posts. Not every topic is a procedure — most gynaecological and obstetric topics (PCOS, endometriosis, fibroids, menstrual disorders, pregnancy care) are medical/diagnostic, not surgical, and should NOT force a step-by-step "how it's performed" structure.

═══════════════════════════════════════
STRUCTURAL REQUIREMENTS
═══════════════════════════════════════

WORD COUNT: 1,800–2,800 words in the article body (excluding frontmatter YAML)

OPENING — MANDATORY FORMAT:
- First sentence: direct definition of the condition/topic.
  Format: "[Condition] is [what it is] — [key clinical fact in one clause]."
- Second sentence: state who the article is for and why it is relevant to them.
- Do NOT open with a statistic, a rhetorical question, or a general context paragraph.

MANDATORY SECTIONS (choose and order to fit the topic — not every section applies to every topic):
1. Definition and mechanism / what is happening in the body
2. Symptoms or how the condition presents (table format where useful)
3. Diagnosis — how it is confirmed, what tests/criteria are used
4. Treatment or management options (table format where useful)
5. FOR GENUINE PROCEDURES ONLY (hymenoplasty, vaginal rejuvenation, MTP, etc.): step-by-step technique — required for HowTo schema
6. When to see a gynaecologist / red flags
7. Cost section — ONLY for procedures with a genuine price range (mainly cosmetic gynaecology); note that an exact figure requires consultation. Skip entirely for non-procedural medical topics (PCOS, endometriosis, general gynaecology) — do not invent a price for a routine medical consultation.
8. Key Points — a "## Key Points" H2 near the end, before References, with 4–6 concise single-sentence bullet takeaways
9. References (3–6 REAL, verifiable citations — see rules below)
10. DO NOT write a medical disclaimer or author block — the site renders these automatically

CLOSING "KEY POINTS" BLOCK — MANDATORY:
- Include a "## Key Points" section with 4–6 single-line bullets summarising the most important takeaways.
- Place it near the end of the article, before the References section.
- Each bullet is one short factual sentence — no superlatives, no guarantees.

HEADINGS:
- One H1 only (matches the title tag closely)
- 5–8 H2 sections covering the applicable sections above
- H3s for sub-symptoms, sub-criteria, or comparison sub-sections
- Every heading must contain at least one keyword or entity name

IMAGES — MINIMUM 2 PER ARTICLE:
- The cover image is provided by the system — do not add it in the body
- Embed the 2 body images provided in the user message using markdown image syntax, placed where topically relevant (e.g. after the "what causes it" section, after the treatment/lifestyle section)
- Each image MUST have a descriptive alt tag (8–15 words) that is clinically accurate and tasteful — never a generic or suggestive caption
- Add a caption below each image as an italic line

INTERNAL LINKS:
- Link to existing published posts on the blog where topically relevant, using descriptive anchor text (not "click here")
- If fewer than 3 existing posts are topically relevant, link to as many as genuinely fit — never force an irrelevant link just to hit a count

REFERENCES — MANDATORY AND MUST BE REAL:
- 3–6 references. Every single one MUST be a real, verifiable, existing publication or guideline — never invent an author, journal, volume, page range, or DOI, even one that "sounds plausible". If you are not certain a specific paper's citation details are accurate, cite a well-established guideline you are confident is real instead (e.g. FOGSI guidelines, ACOG Practice Bulletins, WHO guidance, Cochrane reviews, NICE guidelines, the Rotterdam criteria, Endocrine Society guidelines) — or omit the citation rather than fabricate one.
- Format: Author(s)/Organisation. Title. *Journal or Publisher*. Year;Vol(Issue):Pages.
- Every reference MUST be hyperlinked to its real DOI or PubMed page:
  DOI: <a href="https://doi.org/[DOI]" target="_blank" rel="noopener noreferrer">
  PubMed: <a href="https://pubmed.ncbi.nlm.nih.gov/[PMID]/" target="_blank" rel="noopener noreferrer">
- Cite inline in the body using bracketed numbers, e.g. [1], or [1,2], matching the reference list order.

FAQ — 3 TO 6 QUESTIONS:
- Questions must mirror exact patient search phrasing (how, can, is, what, how much, how long, does)
- Each answer: direct answer in first sentence (15–25 words), then 1–2 supporting sentences
- Total answer length: 40–60 words
- The FAQ frontmatter must EXACTLY match the FAQ section rendered by the site (the frontmatter IS the single source — do not also write a duplicate "Frequently Asked Questions" section in the article body; the site renders the accordion automatically from frontmatter)

REVIEW DATE: Include "_Last medically reviewed by Dr. Arti Sharma, MBBS, DNB (Obstetrics & Gynaecology), KMC Reg. No. 109317 — ${today}_" as a small italic line after the opening paragraph, followed by a horizontal rule (---).

TONE: Precise, evidence-based, compassionate but not saccharine. The voice of a gynaecologist who communicates clinical reality clearly and puts patients at ease. Not promotional. Not jargon-heavy. Never explicit or suggestive, even for cosmetic gynaecology topics.

═══════════════════════════════════════
OUTPUT FORMAT — CRITICAL
═══════════════════════════════════════

Return ONLY a valid MDX file. No preamble, no explanation, no code fences.

FRONTMATTER SCHEMA:
---
title: "Full descriptive H1 title (up to ~70 characters is fine — this is the on-page heading)"
seoTitle: "Concise <title> tag — MAX 45 CHARACTERS, primary keyword or condition only. Do NOT include the brand/author name; the site automatically appends ' | Dr. Arti Sharma'."
description: "Meta description, 150–160 characters and NEVER more than 160. Include the primary keyword, a clear reason to click, and 'Bengaluru' as a geographic signal."
date: "${today}"
targetKeyword: "primary seo keyword phrase"
keywords: ["primary keyword", "long-tail variant 1", "long-tail variant 2", "long-tail variant 3", "bengaluru keyword"]
author: "Dr. Arti Sharma"
tags: ["tag1", "tag2", "tag3"]
coverImage: "3-4 word unsplash search term for a relevant, tasteful medical/clinical image — never a suggestive or intimate-looking image"
# The six procedure* fields and howToName/howToSteps below are OPTIONAL —
# include them ONLY when the topic is a genuine clinical procedure
# (hymenoplasty, vaginal rejuvenation, MTP, etc). Omit entirely for
# medical/diagnostic topics like PCOS, endometriosis, or pregnancy care.
procedureName: "Full Procedure Name (omit if not applicable)"
procedureAlt: "Abbreviation if applicable, else omit this line"
procedureBodyLocation: "e.g. Vaginal/vulvar region (omit if not applicable)"
procedurePrep: "1–2 sentences on pre-procedure preparation (omit if not applicable)"
procedureHow: "2–3 sentences on the technique (omit if not applicable)"
procedureFollowup: "1–2 sentences on recovery and follow-up (omit if not applicable)"
howToName: "How [Procedure Name] is Performed (omit if not applicable)"
howToSteps:
  - name: "Step 1 Name"
    text: "Step 1 description in 1–2 sentences."
faqs:
  - question: "Exact patient-search-style question?"
    answer: "Direct answer in first sentence (15–25 words). Supporting detail in 1–2 sentences. Total 40–60 words."
  - question: "..."
    answer: "..."
---`
}

const ARTI_TOPIC_IDEAS = `Obstetrics & Pregnancy:
• Antenatal care — what to expect at each trimester
• Normal delivery vs caesarean section — how the decision is made
• Danger signs in pregnancy — when to seek urgent care
• Postpartum recovery — physical and emotional changes in the first six weeks
• Nutrition during pregnancy — what to eat and what to avoid

Menstrual & Hormonal Health:
• Dysmenorrhea (painful periods) — causes and when it's not normal
• Irregular periods — common causes beyond PCOS
• Menstrual hygiene and common infections

Gynaecological Conditions:
• Endometriosis — symptoms, diagnosis, and management options
• Uterine fibroids — when they need treatment and when they don't
• Vaginitis — causes, symptoms, and treatment of vaginal infections
• Ovarian cysts — when to worry and when to watch and wait
• Dyspareunia (painful intercourse) — causes and treatment approaches
• Vaginismus — what it is and how it is treated

Family Planning:
• Medical termination of pregnancy (MTP) — options and what to expect
• Surgical termination of pregnancy — dilation and evacuation explained
• Contraception options — an overview for informed choice

Cosmetic Gynaecology:
• Introduction to cosmetic gynaecology — what it covers and who it's for
• Vaginal rejuvenation — what it addresses and what to expect
• Hymenoplasty — a factual, non-judgemental clinical overview

Preventive & General Women's Health:
• Routine gynaecological check-ups — what happens and how often
• Cervical screening (Pap smear/HPV test) — why it matters and how often
• Menopause — symptoms, timeline, and managing the transition`

const TOPIC_IDEAS = `Body Contouring & Liposuction:
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
• Facial fat grafting — restoring volume without implants`

// Flat list of the topic-idea phrases (the "• …" bullets above).
export function topicIdeaList(site = 'sanjog') {
  const source = site === 'arti' ? ARTI_TOPIC_IDEAS : TOPIC_IDEAS
  return source.split('\n')
    .filter(l => l.trim().startsWith('•'))
    .map(l => l.replace(/^\s*•\s*/, '').trim())
    .filter(Boolean)
}

const TOPIC_STOPWORDS = new Set(['after', 'with', 'what', 'which', 'when', 'your', 'into', 'over', 'before', 'that', 'they', 'them', 'this'])

// Distinctive words from the procedure part of an idea (before the — or : ).
function distinctiveTokens(phrase) {
  const lead = phrase.split(/[—–:]/)[0]
  return [...new Set(
    lead.toLowerCase()
      .replace(/\([^)]*\)/g, ' ')     // drop parentheticals e.g. (BBL)
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3 && !TOPIC_STOPWORDS.has(w))
  )]
}

/**
 * Suggest a default topic drawn from the established rules:
 * pick a topic-idea phrase whose procedure isn't already covered by a
 * published title. Falls back to any idea if everything's been covered.
 */
export function suggestTopic(existingTitles = [], site = 'sanjog') {
  const titles = existingTitles.map(t => t.toLowerCase())
  const ideas = topicIdeaList(site)
  const isCovered = idea => {
    const toks = distinctiveTokens(idea)
    return toks.length > 0 && titles.some(t => toks.every(tok => t.includes(tok)))
  }
  const open = ideas.filter(i => !isCovered(i))
  const pool = open.length ? open : ideas
  return pool[Math.floor(Math.random() * pool.length)] || ''
}

/**
 * Build the user message.
 * @param {object} o
 * @param {string[]} o.existingTitles
 * @param {string}   o.internalLinkList
 * @param {string}   o.bodyImageInstructions
 * @param {string}   [o.topicHint]  Doctor's own topic / steering note (optional)
 * @param {string}   [o.site]       'sanjog' (default) or 'arti'
 */
export function buildUserMessage({ existingTitles, internalLinkList, bodyImageInstructions, topicHint, site = 'sanjog' }) {
  const isArti = site === 'arti'
  const hint = (topicHint || '').trim()
  const ideaText = isArti ? ARTI_TOPIC_IDEAS : TOPIC_IDEAS

  const topicSection = hint
    ? `DOCTOR'S TOPIC & DIRECTION FOR THIS POST — FOLLOW THIS CLOSELY:
${hint}

Treat the doctor's direction above as the required subject and angle for this post. The topic-idea list below is only background inspiration — do not override the doctor's instruction with it.`
    : `TOPIC IDEAS — pick the one that best builds topical authority and hasn't been covered:

${ideaText}`

  const practiceLabel = isArti ? "Dr. Arti Sharma's practice" : "Dr. Sanjog Sharma's practice"
  const wordCount = isArti ? '1,800–2,800' : '2,000–3,000'
  const geoLine = isArti
    ? '- Geographic anchor: mention at least one Bengaluru clinic by exact name'
    : '- Geographic anchors: mention both Dubai and Bengaluru clinics'
  const internalLinksHeading = isArti
    ? 'AVAILABLE INTERNAL LINKS — use where topically relevant, with descriptive anchor text:'
    : 'AVAILABLE INTERNAL LINKS — use at least 3 of these in the article body with descriptive anchor text:'
  const internalLinksLine = isArti
    ? '- Link to existing posts where genuinely topically relevant — do not force a link count if few exist yet'
    : '- Minimum 3 internal links with keyword-rich anchor text'
  const referencesLine = isArti
    ? '- 3–6 references, every one a REAL, verifiable publication or guideline — never a fabricated or "plausible-sounding" citation — with DOI/PubMed HTML links and inline [1]-style citations'
    : '- Minimum 4 references with DOI/PubMed HTML links and inline superscript citations'
  const faqLine = isArti
    ? '- 3–6 FAQs in frontmatter only — do not duplicate them as a body section, the site renders the accordion automatically'
    : '- 5–8 FAQs in frontmatter that match the article body FAQ section exactly'

  return `Write a new blog post on a topic relevant to ${practiceLabel}.

ALREADY PUBLISHED — do not repeat these topics:
${existingTitles.map(t => `• ${t}`).join('\n')}

${internalLinksHeading}
${internalLinkList || '  (none yet — this is the first post)'}

BODY IMAGES — embed BOTH of these in the article body with descriptive alt text and captions:
${bodyImageInstructions || '  (no body images available — include image placeholders with descriptive alt text)'}

${topicSection}

Write the complete MDX file now, starting with the --- frontmatter block.

Requirements:
- Choose one archetype from the system prompt and apply it fully
- ${wordCount} words in the article body
- Include the "Last medically reviewed" italic line after the opening paragraph
- First-person clinical voice: 2–3 paragraphs
${geoLine}
- Embed both body images with descriptive alt text and italic captions
${internalLinksLine}
${referencesLine}
${faqLine}
- All entity/geo consistency rules apply`
}

// Turn a list of body-image descriptors into the prompt block.
// Each item: { url, credit } — index starts at 2 to match the template.
export function buildBodyImageInstructions(images) {
  return images
    .filter(Boolean)
    .map((img, i) => {
      const idx = i + 2
      return `Body image ${idx} (embed in article body — add article-specific alt text and caption):
  URL: ${img.url}
  Photographer: ${img.credit || 'provided by Dr. Sharma'}`
    })
    .join('\n\n')
}
