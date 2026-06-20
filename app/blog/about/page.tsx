import type { Metadata } from 'next'
import { AUTHOR, SITE_URL } from '@/lib/constants'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'About Dr. Sanjog Sharma — Plastic Surgeon, Bengaluru',
  description:
    'Dr. Sanjog Sharma (MS, DNB) is a plastic and reconstructive surgeon practising at Aesthetica Veda Clinic, Whitefield, Bengaluru. Trained at Maulana Azad Medical College and AIIMS New Delhi.',
  alternates: { canonical: `${SITE_URL}/blog/about` },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Physician',
  name: AUTHOR.name,
  honorificSuffix: AUTHOR.credentials,
  medicalSpecialty: AUTHOR.specialty,
  worksFor: {
    '@type': 'MedicalOrganization',
    name: AUTHOR.clinic,
    address: {
      '@type': 'PostalAddress',
      addressLocality: AUTHOR.city,
      addressCountry: 'IN',
    },
  },
  identifier: [
    {
      '@type': 'PropertyValue',
      name: 'Karnataka Medical Council Registration',
      value: AUTHOR.kmc,
    },
    {
      '@type': 'PropertyValue',
      name: 'DHA License',
      value: AUTHOR.dha,
    },
  ],
  alumniOf: AUTHOR.training.map((inst) => ({
    '@type': 'EducationalOrganization',
    name: inst,
  })),
  url: AUTHOR.siteUrl,
}

export default function AboutPage() {
  return (
    <>
      <JsonLd data={personSchema} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          About the Author
        </h1>

        <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              {AUTHOR.name}, {AUTHOR.credentials}
            </h2>
            <p className="text-blue-700 font-medium mt-1">{AUTHOR.specialty}</p>
            <p className="text-slate-600 mt-0.5">
              {AUTHOR.clinic}, {AUTHOR.city}
            </p>
          </div>

          <section>
            <h3 className="text-base font-semibold text-slate-800 mb-3 uppercase tracking-wide text-xs">
              Medical Registrations
            </h3>
            <dl className="text-sm text-slate-700 space-y-2">
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-medium">Karnataka Medical Council:</dt>
                <dd>{AUTHOR.kmc}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-medium">
                  Dubai Health Authority (DHA) License:
                </dt>
                <dd>{AUTHOR.dha}</dd>
              </div>
            </dl>
          </section>

          <section>
            <h3 className="text-base font-semibold text-slate-800 mb-3 uppercase tracking-wide text-xs">
              Training &amp; Education
            </h3>
            <ul className="text-sm text-slate-700 space-y-1">
              {AUTHOR.training.map((inst) => (
                <li key={inst} className="flex gap-2">
                  <span className="text-blue-400 mt-0.5">▸</span>
                  {inst}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-base font-semibold text-slate-800 mb-3 uppercase tracking-wide text-xs">
              About This Blog
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              This blog publishes educational articles on plastic and
              reconstructive surgery. Content is intended to support patient
              education and public understanding of surgical conditions and
              procedures. All articles are authored by Dr. Sanjog Sharma based
              on current medical literature and clinical experience.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mt-3">
              Articles on this blog are for general educational purposes only
              and do not constitute medical advice. They do not replace a
              personalised in-person consultation with a qualified surgeon.
            </p>
          </section>

          <div className="pt-4 border-t border-slate-200">
            <a
              href={AUTHOR.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
            >
              Visit drsanjog.com →
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
