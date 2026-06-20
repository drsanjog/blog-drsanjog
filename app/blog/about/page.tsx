import type { Metadata } from 'next'
import { AUTHOR, SITE_URL } from '@/lib/constants'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'About Dr. Sanjog Sharma — Plastic Surgeon, Dubai & Bengaluru',
  description:
    'Dr. Sanjog Sharma (MBBS, MS, DNB) is a plastic and cosmetic surgeon practising at Cocoona Centre, Emirates Hospital, and Dubai London Hospital in Dubai, and at Aesthetica Veda Clinic, Bengaluru. Over 10 years experience, 250+ procedures annually.',
  alternates: { canonical: `${SITE_URL}/blog/about` },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Physician',
  name: AUTHOR.name,
  honorificSuffix: AUTHOR.credentials,
  medicalSpecialty: AUTHOR.specialty,
  affiliation: [
    ...AUTHOR.dubaiClinics.map((c) => ({
      '@type': 'MedicalOrganization',
      name: c.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: c.location,
        addressCountry: 'AE',
      },
    })),
    {
      '@type': 'MedicalOrganization',
      name: AUTHOR.clinic,
      address: {
        '@type': 'PostalAddress',
        addressLocality: AUTHOR.city,
        addressCountry: 'IN',
      },
    },
  ],
  identifier: [
    {
      '@type': 'PropertyValue',
      name: 'Karnataka Medical Council Registration',
      value: AUTHOR.kmc,
    },
    {
      '@type': 'PropertyValue',
      name: 'Dubai Health Authority License',
      value: AUTHOR.dha,
    },
  ],
  alumniOf: AUTHOR.training.map((inst) => ({
    '@type': 'EducationalOrganization',
    name: inst,
  })),
  memberOf: {
    '@type': 'MedicalOrganization',
    name: 'Association of Plastic Surgeons of India (APSI)',
  },
  url: AUTHOR.siteUrl,
}

export default function AboutPage() {
  return (
    <>
      <JsonLd data={personSchema} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-brand-charcoal mb-8">
          About the Author
        </h1>

        <div className="bg-white rounded-xl border border-brand-charcoal/10 p-8 space-y-8">

          {/* Name + credentials */}
          <div>
            <h2 className="text-2xl font-semibold text-brand-charcoal">
              {AUTHOR.name}, {AUTHOR.credentials}
            </h2>
            <p className="text-brand-rust font-medium mt-1">{AUTHOR.specialty}</p>
            <p className="text-brand-charcoal/60 text-sm mt-1">
              {AUTHOR.yearsExperience} years experience &nbsp;·&nbsp; {AUTHOR.proceduresPerYear} procedures/year
            </p>
          </div>

          {/* Bio */}
          <section>
            <p className="text-sm text-brand-charcoal/80 leading-relaxed">
              Dr. Sanjog Sharma is a board-certified plastic and cosmetic surgeon based
              primarily in Dubai, where he operates at Cocoona Centre for Aesthetic
              Transformation (Al Wasl Road), Emirates Hospital (Jumeirah), and Dubai London
              Hospital (Jumeirah). His practice is built around high-volume body contouring
              surgery — VASER liposuction, high-definition liposuction, tummy tucks, mommy
              makeovers, post-bariatric contouring, and body contouring for patients following
              GLP-1 (Ozempic/Wegovy) weight loss.
            </p>
            <p className="text-sm text-brand-charcoal/80 leading-relaxed mt-3">
              He is also available in Bengaluru, operating at Aesthetica Veda Clinic,
              Whitefield — giving patients in South India direct access to the same
              surgical standards and protocols he applies in Dubai. With training at Lok
              Nayak Hospital (New Delhi) and AIIMS New Delhi, and over a decade of
              clinical practice across the UAE and India, he brings Gulf-level body
              contouring to patients who want international quality without travelling abroad.
            </p>
          </section>

          {/* Dubai practice — primary */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-charcoal/40 mb-3">
              Dubai Practice (Primary)
            </h3>
            <ul className="space-y-2">
              {AUTHOR.dubaiClinics.map((c) => (
                <li key={c.name} className="flex items-start gap-2 text-sm text-brand-charcoal/80">
                  <span className="text-brand-rust mt-0.5 shrink-0">▸</span>
                  <span>
                    <strong className="font-medium text-brand-charcoal">{c.name}</strong>
                    {' — '}{c.location}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-brand-charcoal/50 mt-2">
              Dubai contact: {AUTHOR.dubaiPhone}
            </p>
          </section>

          {/* Bengaluru practice — secondary */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-charcoal/40 mb-3">
              Bengaluru Practice (Selective Visits)
            </h3>
            <p className="text-sm text-brand-charcoal/80">
              <strong className="font-medium text-brand-charcoal">{AUTHOR.clinic}</strong>
              {' — '}{AUTHOR.city}
            </p>
            <p className="text-xs text-brand-charcoal/50 mt-1">
              India contact: {AUTHOR.bangalorePhone}
            </p>
          </section>

          {/* Registrations */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-charcoal/40 mb-3">
              Medical Registrations
            </h3>
            <dl className="text-sm text-brand-charcoal/80 space-y-2">
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-medium text-brand-charcoal">Karnataka Medical Council:</dt>
                <dd>{AUTHOR.kmc}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-medium text-brand-charcoal">Dubai Health Authority (DHA) License:</dt>
                <dd>{AUTHOR.dha}</dd>
              </div>
            </dl>
          </section>

          {/* Training */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-charcoal/40 mb-3">
              Training &amp; Education
            </h3>
            <ul className="text-sm text-brand-charcoal/80 space-y-1">
              {AUTHOR.training.map((inst) => (
                <li key={inst} className="flex gap-2">
                  <span className="text-brand-rust mt-0.5 shrink-0">▸</span>
                  {inst}
                </li>
              ))}
            </ul>
          </section>

          {/* Membership */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-charcoal/40 mb-3">
              Professional Membership
            </h3>
            <p className="text-sm text-brand-charcoal/80">{AUTHOR.apsi}</p>
          </section>

          {/* About this blog */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-charcoal/40 mb-3">
              About This Blog
            </h3>
            <p className="text-sm text-brand-charcoal/80 leading-relaxed">
              This blog publishes educational articles on plastic and cosmetic surgery, with a
              focus on body contouring, recovery, and patient selection. All articles are
              authored by Dr. Sanjog Sharma based on peer-reviewed literature and clinical
              experience. Content is intended for general educational purposes only and does
              not constitute medical advice. It does not replace a personalised in-person
              consultation with a qualified surgeon.
            </p>
          </section>

          <div className="pt-4 border-t border-brand-charcoal/10 flex flex-wrap gap-3">
            <a
              href={AUTHOR.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-brand-rust text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-charcoal transition-colors"
            >
              Visit drsanjog.com →
            </a>
            <a
              href={AUTHOR.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-brand-charcoal/20 text-brand-charcoal px-5 py-2.5 rounded-lg text-sm font-medium hover:border-brand-rust hover:text-brand-rust transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
