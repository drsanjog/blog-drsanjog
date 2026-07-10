import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { AUTHOR, SITE_URL } from '@/lib/constants'
import JsonLd from '@/components/JsonLd'
import Breadcrumb from '@/components/Breadcrumb'

const PAGE_URL = `${SITE_URL}/blog/body-contouring`

export const metadata: Metadata = {
  // seoTitle-style: concise; layout appends " | Dr. Sanjog Sharma"
  title: 'Body Contouring Surgery Guide',
  description:
    'A complete guide to body contouring surgery — liposuction, tummy tuck, arm and thigh lifts, BBL, and post-weight-loss procedures in Bengaluru and Dubai.',
  keywords: [
    'body contouring surgery', 'body contouring Bengaluru', 'body contouring Dubai',
    'liposuction', 'tummy tuck', 'arm lift', 'thigh lift', 'mommy makeover',
    'body contouring after weight loss', 'body contouring after Ozempic', 'BBL India',
  ],
  alternates: {
    canonical: PAGE_URL,
    languages: { 'en-IN': PAGE_URL, 'en-AE': PAGE_URL },
  },
  openGraph: {
    title: 'Body Contouring Surgery — Complete Guide',
    description:
      'Liposuction, tummy tuck, arm and thigh lifts, BBL, and post-weight-loss body contouring — evidence-based guides by Dr. Sanjog Sharma (Dubai & Bengaluru).',
    url: PAGE_URL,
    type: 'website',
  },
}

// The body-contouring content cluster this pillar page organises.
const CATEGORIES: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: 'Liposuction & Fat Removal',
    blurb: 'Removing localised fat and refining contour with ultrasound-assisted and high-definition techniques.',
    slugs: [
      'vaser-liposuction-vs-traditional-liposuction-whats-the-difference',
      'highdefinition-liposuction-achieving-muscle-definition-with-vaser-hd',
      'liposuction-vs-tummy-tuck',
    ],
  },
  {
    title: 'Skin Tightening & Lifts',
    blurb: 'Excisional procedures that remove loose skin the way liposuction alone cannot.',
    slugs: [
      'tummy-tuck-after-weight-loss-timing-technique-and-what-to-expect-in-be',
      'arm-lift-surgery-brachioplasty-when-liposuction-alone-is-not-enough',
      'thigh-lift-surgery-inner-vs-outer-thigh-contouring-what-to-expect',
    ],
  },
  {
    title: 'After Weight Loss (GLP-1 & Bariatric)',
    blurb: 'What changes surgically once significant weight has come off with Ozempic, Wegovy, or bariatric surgery.',
    slugs: [
      'body-contouring-after-ozempic-and-glp1-weight-loss-what-surgery-can-and-can',
    ],
  },
  {
    title: 'Volume, Shaping & Combined Procedures',
    blurb: 'Fat transfer and combined operations that reshape rather than only reduce.',
    slugs: [
      'brazilian-butt-lift-in-india-patient-selection-safety-and-what-to-realistic',
      'mommy-makeover-surgery-which-procedures-are-combined-and-why',
    ],
  },
  {
    title: 'Male Body Contouring',
    blurb: 'Procedures specific to male anatomy and presentation.',
    slugs: [
      'understanding-gynecomastia-grades-simons-classification',
    ],
  },
]

const CLUSTER_SLUGS = CATEGORIES.flatMap((c) => c.slugs)

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Blog', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Body Contouring Surgery', item: PAGE_URL },
  ],
}

export default function BodyContouringPillarPage() {
  const bySlug = new Map(getAllPosts().map((p) => [p.slug, p]))

  // CollectionPage + ItemList so search/AI systems can read the content map.
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${PAGE_URL}/#pillar`,
    url: PAGE_URL,
    name: 'Body Contouring Surgery — Complete Guide',
    description:
      'Pillar guide to body contouring surgery by Dr. Sanjog Sharma (MBBS, MS, DNB), linking evidence-based articles on liposuction, lifts, and post-weight-loss procedures across Dubai and Bengaluru.',
    about: { '@type': 'MedicalProcedure', name: 'Body Contouring Surgery', procedureType: 'Surgical' },
    author: { '@type': 'Physician', name: AUTHOR.name, honorificSuffix: AUTHOR.credentials },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: CLUSTER_SLUGS.filter((s) => bySlug.has(s)).map((slug, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/blog/${slug}`,
        name: bySlug.get(slug)!.frontmatter.title,
      })),
    },
  }

  return (
    <>
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Breadcrumb items={[{ label: 'Blog', href: '/' }, { label: 'Body Contouring Surgery' }]} />

        {/* Hero */}
        <header className="mb-12">
          <div className="inline-block bg-brand-olive/10 text-brand-olive text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Pillar Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-charcoal leading-tight mb-4">
            Body Contouring Surgery: A Complete Guide
          </h1>
          <p className="text-lg text-brand-charcoal/70 leading-relaxed max-w-2xl">
            Body contouring is a family of procedures that reshape the body by removing excess fat,
            tightening loose skin, or both. This guide from Dr. Sanjog Sharma, MBBS MS DNB — practising
            in Dubai and at Aesthetica Veda Clinic, Whitefield, Bengaluru — explains how the main
            procedures differ, who each one suits, and how they are often combined.
          </p>
        </header>

        {/* Orientation prose */}
        <section className="prose max-w-none prose-p:text-brand-charcoal/80 prose-headings:text-brand-charcoal mb-12">
          <p>
            Broadly, body contouring divides into two mechanisms. <strong>Liposuction-based
            procedures</strong> remove localised fat deposits and refine shape, and work best when skin
            elasticity is good. <strong>Excisional procedures</strong> — tummy tuck, arm lift, thigh
            lift — remove loose skin that liposuction alone cannot address, which becomes especially
            relevant after pregnancy or significant weight loss. Many patients need a combination, and
            increasingly, patients who have lost weight on GLP-1 medications such as Ozempic present with
            skin laxity that shifts the surgical plan.
          </p>
          <p>
            Use the sections below to read the detailed article for each procedure. Every article covers
            candidacy, technique, recovery, realistic costs in INR and AED, and safety.
          </p>
        </section>

        {/* Category clusters */}
        {CATEGORIES.map((cat) => {
          const posts = cat.slugs.map((s) => bySlug.get(s)).filter(Boolean)
          if (posts.length === 0) return null
          return (
            <section key={cat.title} className="mb-10">
              <h2 className="text-xl font-semibold text-brand-charcoal mb-1">{cat.title}</h2>
              <p className="text-sm text-brand-charcoal/60 mb-4">{cat.blurb}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {posts.map((post) => (
                  <Link
                    key={post!.slug}
                    href={`/blog/${post!.slug}`}
                    className="group bg-white rounded-lg border border-brand-charcoal/10 p-4 hover:border-brand-rust/30 hover:shadow-sm transition-all"
                  >
                    <p className="text-sm font-medium text-brand-charcoal group-hover:text-brand-rust transition-colors leading-snug">
                      {post!.frontmatter.title}
                    </p>
                    <p className="text-xs text-brand-charcoal/50 mt-1 line-clamp-2">
                      {post!.frontmatter.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        {/* CTA */}
        <div className="mt-12 pt-8 border-t border-brand-charcoal/10 text-center">
          <p className="text-brand-charcoal/70 text-sm mb-4">
            Considering body contouring in Bengaluru or Dubai? Discuss your options with Dr. Sanjog Sharma.
          </p>
          <a
            href={AUTHOR.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-rust text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-brand-charcoal transition-colors"
          >
            Request a Consultation at drsanjog.com →
          </a>
        </div>
      </div>
    </>
  )
}
