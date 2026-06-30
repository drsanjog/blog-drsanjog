import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { AUTHOR, SITE_URL } from '@/lib/constants'
import JsonLd from '@/components/JsonLd'
import Breadcrumb from '@/components/Breadcrumb'

const PAGE_URL = `${SITE_URL}/blog/cosmetic-surgery-dubai`

export const metadata: Metadata = {
  title: 'Cosmetic Surgery in Dubai | Dr. Sanjog Sharma at Cocoona & Emirates Hospital',
  description:
    'Dr. Sanjog Sharma (MBBS, MS, DNB) is a DHA-licensed plastic surgeon practising at Cocoona Centre for Aesthetic Transformation, Emirates Hospital, and Dubai London Hospital — VASER liposuction, tummy tuck, and body contouring in Dubai.',
  keywords: [
    'plastic surgery Dubai', 'cosmetic surgery Dubai', 'VASER liposuction Dubai',
    'tummy tuck Dubai', 'body contouring Dubai', 'Indian plastic surgeon Dubai',
    'Cocoona Centre Dubai', 'Emirates Hospital plastic surgery', 'Dubai London Hospital cosmetic surgery',
    'DHA licensed plastic surgeon', 'body contouring after Ozempic Dubai',
  ],
  alternates: {
    canonical: PAGE_URL,
    languages: { 'en-AE': PAGE_URL, 'en-IN': PAGE_URL, 'en-GB': PAGE_URL },
  },
  openGraph: {
    title: 'Cosmetic Surgery in Dubai | Dr. Sanjog Sharma',
    description:
      'DHA-licensed plastic surgeon at Cocoona Centre, Emirates Hospital, and Dubai London Hospital. VASER liposuction, body contouring, and post-weight-loss procedures in Dubai.',
    url: PAGE_URL,
    type: 'website',
  },
}

const dubaiSchema = {
  '@context': 'https://schema.org',
  '@type': ['MedicalBusiness', 'LocalBusiness'],
  '@id': `${SITE_URL}/#dubai-practice`,
  name: 'Dr. Sanjog Sharma — Plastic & Cosmetic Surgery Dubai',
  description:
    'DHA-licensed plastic and cosmetic surgeon practising at Cocoona Centre for Aesthetic Transformation, Emirates Hospital, and Dubai London Hospital in Dubai.',
  telephone: AUTHOR.dubaiPhone,
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    name: 'Dubai Health Authority Medical Licence',
    recognizedBy: { '@type': 'Organization', name: 'Dubai Health Authority' },
    identifier: AUTHOR.dha,
  },
  location: AUTHOR.dubaiClinics.map((c) => ({
    '@type': 'Place',
    name: c.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: c.location,
      addressLocality: 'Dubai',
      addressCountry: 'AE',
    },
  })),
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '09:00', closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '09:00', closes: '14:00',
    },
  ],
  priceRange: 'AED AED AED',
  currenciesAccepted: 'AED',
  medicalSpecialty: ['Plastic Surgery', 'Cosmetic Surgery', 'Body Contouring'],
  areaServed: [
    { '@type': 'City', name: 'Dubai' },
    { '@type': 'Country', name: 'United Arab Emirates' },
  ],
  sameAs: [AUTHOR.siteUrl, AUTHOR.instagram],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Blog', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Cosmetic Surgery in Dubai', item: PAGE_URL },
  ],
}

const DUBAI_POSTS = [
  'vaser-liposuction-vs-traditional-liposuction-whats-the-difference',
  'highdefinition-liposuction-achieving-muscle-definition-with-vaser-hd',
  'body-contouring-after-ozempic-and-glp1-weight-loss-what-surgery-can-and-can',
  'tummy-tuck-after-weight-loss-timing-technique-and-what-to-expect-in-be',
  'liposuction-vs-tummy-tuck',
  'mommy-makeover-surgery-which-procedures-are-combined-and-why',
  'brazilian-butt-lift-in-india-patient-selection-safety-and-what-to-realistic',
]

export default function CosmeticSurgeryDubaiPage() {
  const allPosts = getAllPosts()
  const posts = allPosts.filter((p) => DUBAI_POSTS.includes(p.slug))

  return (
    <>
      <JsonLd data={dubaiSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Breadcrumb items={[{ label: 'Blog', href: '/' }, { label: 'Cosmetic Surgery in Dubai' }]} />

        {/* Hero */}
        <header className="mb-12">
          <div className="inline-block bg-brand-rust/10 text-brand-rust text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Dubai Practice
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-charcoal leading-tight mb-4">
            Cosmetic &amp; Plastic Surgery in Dubai
          </h1>
          <p className="text-lg text-brand-charcoal/70 leading-relaxed max-w-2xl">
            Dr. Sanjog Sharma, MBBS MS DNB — DHA-licensed plastic and cosmetic surgeon practising at
            three leading hospitals across Dubai. Specialising in body contouring, VASER liposuction,
            tummy tuck, and post-weight-loss procedures for a diverse international patient population.
          </p>
        </header>

        {/* DHA badge */}
        <div className="bg-brand-rust/5 border border-brand-rust/15 rounded-xl p-4 mb-10 flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/40">DHA Licence</p>
            <p className="font-mono text-brand-charcoal font-medium">{AUTHOR.dha}</p>
          </div>
          <div className="h-8 w-px bg-brand-charcoal/10 hidden sm:block" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/40">Credential</p>
            <p className="text-brand-charcoal font-medium">{AUTHOR.credentialsFull}</p>
          </div>
          <div className="h-8 w-px bg-brand-charcoal/10 hidden sm:block" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/40">Experience</p>
            <p className="text-brand-charcoal font-medium">{AUTHOR.yearsExperience} years · {AUTHOR.proceduresPerYear} procedures/year</p>
          </div>
        </div>

        {/* Dubai hospitals */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-brand-charcoal mb-6">Dubai Hospitals &amp; Clinics</h2>
          <div className="space-y-4">
            {AUTHOR.dubaiClinics.map((c) => (
              <div key={c.name} className="bg-white rounded-xl border border-brand-charcoal/10 p-5 flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-brand-rust mt-2 shrink-0" />
                <div>
                  <p className="font-semibold text-brand-charcoal">{c.name}</p>
                  <p className="text-sm text-brand-charcoal/60 mt-0.5">{c.location}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <a href={`tel:${AUTHOR.dubaiPhone.replace(/\s/g, '')}`} className="text-brand-rust font-medium hover:underline">
              📞 {AUTHOR.dubaiPhone}
            </a>
          </div>
        </section>

        {/* International patients */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-brand-charcoal mb-4">International Patient Base</h2>
          <p className="text-sm text-brand-charcoal/80 leading-relaxed mb-4">
            Dr. Sharma's Dubai practice serves a wide ethnic and national patient mix — South Asian (Indian,
            Pakistani, Sri Lankan), Arab and Middle Eastern, African, British, and Western expatriates. This
            breadth of clinical exposure informs a nuanced approach to body contouring across different skin
            types (Fitzpatrick I–VI), fat distribution patterns, and aesthetic goals.
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              ['South Asian Patients', 'Fitzpatrick III–VI skin — tailored approach to scarring risk and liposuction technique'],
              ['Arab & Middle Eastern', 'Body contouring aligned with culturally appropriate aesthetic goals'],
              ['Western Expatriates', 'International protocol standards — ISAPS / ASPS-aligned surgical planning'],
            ].map(([title, desc]) => (
              <div key={title} className="bg-brand-cream rounded-lg border border-brand-charcoal/10 p-4">
                <p className="font-medium text-brand-charcoal text-sm mb-1">{title}</p>
                <p className="text-xs text-brand-charcoal/60">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Procedures */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-brand-charcoal mb-6">Procedures in Dubai</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ['VASER Liposuction', 'Ultrasound-assisted fat emulsification for smoother contouring'],
              ['High-Definition (HD) Liposuction', 'Athletic muscular definition through VASER Hi-Def technique'],
              ['Tummy Tuck (Abdominoplasty)', 'Skin excision and abdominal wall tightening'],
              ['Post-GLP-1 Body Contouring', 'Targeted approach for Ozempic/Wegovy weight-loss patients'],
              ['Post-Bariatric Contouring', 'Staged skin excision after sleeve/bypass procedures'],
              ['Brazilian Butt Lift', 'Fat transfer for buttock volume with VASER harvest'],
              ['Arm Lift & Thigh Lift', 'Skin excision with detailed scar placement planning'],
              ['Rhinoplasty', 'Including South Asian, Arab, and African nasal anatomy'],
            ].map(([name, desc]) => (
              <div key={name} className="bg-white rounded-lg border border-brand-charcoal/10 p-4">
                <p className="font-medium text-brand-charcoal text-sm">{name}</p>
                <p className="text-xs text-brand-charcoal/60 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Articles */}
        <section>
          <h2 className="text-xl font-semibold text-brand-charcoal mb-2">Read: Clinical Articles</h2>
          <p className="text-sm text-brand-charcoal/60 mb-6">
            Authored by Dr. Sanjog Sharma from clinical practice in Dubai.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-lg border border-brand-charcoal/10 p-4 hover:border-brand-rust/30 hover:shadow-sm transition-all"
              >
                <p className="text-sm font-medium text-brand-charcoal group-hover:text-brand-rust transition-colors leading-snug">
                  {post.frontmatter.title}
                </p>
                <p className="text-xs text-brand-charcoal/50 mt-1 line-clamp-2">
                  {post.frontmatter.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-12 pt-8 border-t border-brand-charcoal/10 text-center">
          <p className="text-brand-charcoal/70 text-sm mb-4">
            Enquire about a consultation at our Dubai hospitals
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
