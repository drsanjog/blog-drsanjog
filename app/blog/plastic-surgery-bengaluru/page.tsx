import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { AUTHOR, SITE_URL } from '@/lib/constants'
import JsonLd from '@/components/JsonLd'
import Breadcrumb from '@/components/Breadcrumb'

const PAGE_URL = `${SITE_URL}/blog/plastic-surgery-bengaluru`

export const metadata: Metadata = {
  title: 'Plastic Surgery in Bengaluru | Dr. Sanjog Sharma, MBBS MS DNB',
  description:
    'Dr. Sanjog Sharma (MBBS, MS, DNB) offers VASER liposuction, tummy tuck, mommy makeover, and body contouring at Aesthetica Veda Clinic, Whitefield, Bengaluru — applying the same surgical standards he practises in Dubai.',
  keywords: [
    'plastic surgery Bengaluru', 'cosmetic surgery Whitefield', 'liposuction Bengaluru',
    'tummy tuck Bangalore', 'VASER liposuction Bengaluru', 'body contouring Bengaluru',
    'plastic surgeon Whitefield', 'mommy makeover Bengaluru', 'Dr Sanjog Sharma Bengaluru',
    'cosmetic surgery NRI India', 'plastic surgery Indian expat',
  ],
  alternates: {
    canonical: PAGE_URL,
    languages: { 'en-IN': PAGE_URL, 'en-AE': PAGE_URL },
  },
  openGraph: {
    title: 'Plastic Surgery in Bengaluru | Dr. Sanjog Sharma',
    description:
      'VASER liposuction, tummy tuck, mommy makeover, and body contouring in Whitefield, Bengaluru — Dubai-trained surgeon, same international standards.',
    url: PAGE_URL,
    type: 'website',
  },
}

const localSchema = {
  '@context': 'https://schema.org',
  '@type': ['MedicalBusiness', 'LocalBusiness'],
  '@id': `${SITE_URL}/#bengaluru-clinic`,
  name: 'Aesthetica Veda Clinic — Dr. Sanjog Sharma',
  url: AUTHOR.siteUrl,
  telephone: AUTHOR.bangalorePhone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Whitefield',
    addressLocality: 'Whitefield',
    addressRegion: 'Karnataka',
    postalCode: '560066',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 12.9698, longitude: 77.751 },
  hasMap: 'https://maps.app.goo.gl/X4SSFU4FTGvVEKMT7',
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '10:00', closes: '19:00',
  }],
  priceRange: '₹₹₹',
  medicalSpecialty: ['Plastic Surgery', 'Cosmetic Surgery', 'Body Contouring'],
  areaServed: [
    { '@type': 'City', name: 'Bengaluru' },
    { '@type': 'AdministrativeArea', name: 'Karnataka' },
    { '@type': 'Country', name: 'India' },
  ],
  sameAs: [AUTHOR.siteUrl, AUTHOR.instagram],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Blog', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Plastic Surgery in Bengaluru', item: PAGE_URL },
  ],
}

const BENGALURU_POSTS = [
  'liposuction-vs-tummy-tuck',
  'vaser-liposuction-vs-traditional-liposuction-whats-the-difference',
  'highdefinition-liposuction-achieving-muscle-definition-with-vaser-hd',
  'mommy-makeover-surgery-which-procedures-are-combined-and-why',
  'tummy-tuck-after-weight-loss-timing-technique-and-what-to-expect-in-be',
  'body-contouring-after-ozempic-and-glp1-weight-loss-what-surgery-can-and-can',
  'understanding-gynecomastia-grades-simons-classification',
  'brazilian-butt-lift-in-india-patient-selection-safety-and-what-to-realistic',
  'rhinoplasty-recovery-timeline',
]

export default function PlasticSurgeryBengaluruPage() {
  const allPosts = getAllPosts()
  const posts = allPosts.filter((p) => BENGALURU_POSTS.includes(p.slug))

  return (
    <>
      <JsonLd data={localSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Breadcrumb items={[{ label: 'Blog', href: '/' }, { label: 'Plastic Surgery in Bengaluru' }]} />

        {/* Hero */}
        <header className="mb-12">
          <div className="inline-block bg-brand-olive/10 text-brand-olive text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Bengaluru Practice
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-charcoal leading-tight mb-4">
            Plastic &amp; Cosmetic Surgery in Bengaluru
          </h1>
          <p className="text-lg text-brand-charcoal/70 leading-relaxed max-w-2xl">
            Dr. Sanjog Sharma, MBBS MS DNB — plastic and cosmetic surgeon practising at{' '}
            <strong className="text-brand-charcoal">Aesthetica Veda Clinic, Whitefield</strong> — brings the
            same surgical protocols he applies at Cocoona Centre and Emirates Hospital in Dubai directly
            to patients in South India.
          </p>
        </header>

        {/* Clinic card */}
        <section className="bg-white rounded-xl border border-brand-charcoal/10 p-6 mb-10">
          <h2 className="text-lg font-semibold text-brand-charcoal mb-4">Bengaluru Clinic</h2>
          <dl className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/40 mb-1">Practice</dt>
              <dd className="text-brand-charcoal">{AUTHOR.clinic}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/40 mb-1">Location</dt>
              <dd className="text-brand-charcoal">
                <a
                  href="https://maps.app.goo.gl/X4SSFU4FTGvVEKMT7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-brand-rust transition-colors"
                >
                  Whitefield, Bengaluru, Karnataka
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/40 mb-1">Phone</dt>
              <dd><a href={`tel:${AUTHOR.bangalorePhone.replace(/\s/g, '')}`} className="text-brand-rust font-medium">{AUTHOR.bangalorePhone}</a></dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/40 mb-1">Hours</dt>
              <dd className="text-brand-charcoal">Mon–Sat, 10:00 AM – 7:00 PM</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/40 mb-1">KMC Registration</dt>
              <dd className="text-brand-charcoal/70">{AUTHOR.kmc}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/40 mb-1">DHA Licence (Dubai)</dt>
              <dd className="text-brand-charcoal/70">{AUTHOR.dha}</dd>
            </div>
          </dl>
        </section>

        {/* Procedures */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-brand-charcoal mb-2">Procedures Available in Bengaluru</h2>
          <p className="text-sm text-brand-charcoal/60 mb-6">
            The same procedures and protocols performed at our Dubai hospitals — available at Whitefield.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ['VASER Liposuction', 'Ultrasound-assisted fat removal with smooth, even results'],
              ['High-Definition Liposuction', 'Etching muscular anatomy for an athletic contour'],
              ['Tummy Tuck (Abdominoplasty)', 'Skin and muscle tightening for the lower abdomen'],
              ['Mommy Makeover', 'Combined abdominoplasty, liposuction, and breast procedure'],
              ['Brazilian Butt Lift (BBL)', 'Fat transfer for buttock volume and projection'],
              ['Arm Lift (Brachioplasty)', 'Removal of loose upper arm skin'],
              ['Thigh Lift', 'Medial and lateral thigh skin reduction'],
              ['Gynecomastia Surgery', 'Glandular excision and liposuction for male breast reduction'],
              ['Body Contouring After Weight Loss', 'Post-bariatric and post-GLP-1 procedures'],
              ['Rhinoplasty', 'Nasal reshaping including South Asian anatomy'],
            ].map(([name, desc]) => (
              <div key={name} className="bg-white rounded-lg border border-brand-charcoal/10 p-4">
                <p className="font-medium text-brand-charcoal text-sm">{name}</p>
                <p className="text-xs text-brand-charcoal/60 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* NRI / Expat section */}
        <section className="bg-brand-olive/5 border border-brand-olive/20 rounded-xl p-6 mb-12">
          <h2 className="text-lg font-semibold text-brand-charcoal mb-3">
            For NRI &amp; Expat Patients Visiting Bengaluru
          </h2>
          <p className="text-sm text-brand-charcoal/80 leading-relaxed mb-3">
            A significant proportion of patients at Aesthetica Veda Clinic are Indian expatriates — from
            the UAE, UK, Australia, Canada, and the United States — who schedule surgery during visits
            home. They benefit from the same surgical standards available internationally, at a fraction
            of the cost, with the continuity of seeing the same surgeon they may have already consulted
            in Dubai.
          </p>
          <p className="text-sm text-brand-charcoal/80 leading-relaxed">
            For travelling patients: plan a minimum stay of 10–14 days (longer for combined procedures),
            arrange a pre-operative in-person assessment 1–2 days before surgery, and plan to return for
            a suture removal visit at 7–10 days. Post-operative follow-up can be coordinated with a local
            surgeon in your home country for ongoing wound care.
          </p>
        </section>

        {/* Articles */}
        <section>
          <h2 className="text-xl font-semibold text-brand-charcoal mb-2">Read: Plastic Surgery Articles</h2>
          <p className="text-sm text-brand-charcoal/60 mb-6">
            Evidence-based articles by Dr. Sanjog Sharma on procedures available in Bengaluru.
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
            Book a consultation at Aesthetica Veda Clinic, Whitefield, Bengaluru
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
