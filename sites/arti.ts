import type { SiteConfig } from '@/lib/site-config'

const SITE_URL = 'https://blog.drarti.in'

// ── Raw identity (sourced from drarti.in + KMC registration certificate) ────
const A = {
  name: 'Dr. Arti Sharma',
  credentials: 'MBBS, DNB',
  credentialsFull: 'MBBS, DNB (Obstetrics & Gynaecology), Diploma in Cosmetic Gynaecology',
  specialty: 'Obstetrics & Gynaecology',
  // Bengaluru practice — three locations
  clinics: [
    { name: 'Cloudnine Hospital', location: 'Sarjapur Road, Bengaluru' },
    { name: 'Docube Clinic', location: 'Doddakannelli, Sarjapur Road, Bengaluru' },
    { name: 'Aesthetica Veda', location: 'Koramangala, Bengaluru' },
  ],
  phone: '+91 90196 38165',
  cosmeticPhone: '+91 97414 35255',
  kmc: '109317',
  training: [
    'Kasturba Medical College, Manipal Academy of Higher Education',
    'National Board of Examinations (DNB), New Delhi',
    'University Medicine Greifswald, Germany — Cosmetic Gynaecology',
  ],
  siteUrl: 'https://www.drarti.in',
  instagram: 'https://www.instagram.com/sdrarti',
  facebook: 'https://www.facebook.com/114970496553784',
}

// ── MedicalBusiness schema — Bengaluru OBG practice ─────────────────────────
const bengaluruSchema = {
  '@context': 'https://schema.org',
  '@type': ['MedicalBusiness', 'LocalBusiness'],
  '@id': `${SITE_URL}/#bengaluru-practice`,
  name: 'Dr. Arti Sharma — Obstetrics, Gynaecology & Cosmetic Gynaecology',
  url: A.siteUrl,
  description:
    'Obstetrics and gynaecology practice in Bengaluru led by Dr. Arti Sharma (MBBS, DNB). Antenatal and delivery care, PCOS, endometriosis, fibroids, menstrual disorders, and cosmetic gynaecology across Cloudnine Hospital (Sarjapur Road), Docube Clinic, and Aesthetica Veda (Koramangala).',
  telephone: A.phone,
  medicalSpecialty: ['Obstetrics', 'Gynecologic', 'Reproductive'],
  location: A.clinics.map((c) => ({
    '@type': 'Place',
    name: c.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: c.location,
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      addressCountry: 'IN',
    },
  })),
  priceRange: '₹₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, Debit Card, Bank Transfer, Insurance',
  availableService: [
    { '@type': 'MedicalTherapy', name: 'Antenatal & Pregnancy Care' },
    { '@type': 'MedicalTherapy', name: 'Normal & Caesarean Delivery' },
    { '@type': 'MedicalTherapy', name: 'Polycystic Ovarian Syndrome (PCOS) Management' },
    { '@type': 'MedicalTherapy', name: 'Endometriosis Treatment' },
    { '@type': 'MedicalTherapy', name: 'Uterine Fibroid Management' },
    { '@type': 'MedicalTherapy', name: 'Menstrual Disorder Treatment' },
    { '@type': 'MedicalTherapy', name: 'Vaginitis & Vaginal Infection Treatment' },
    { '@type': 'MedicalTherapy', name: 'Cosmetic Gynaecology (Vaginal Rejuvenation, Hymenoplasty)' },
    { '@type': 'MedicalTherapy', name: 'Medical Termination of Pregnancy (MTP)' },
  ],
  staff: {
    '@type': 'Physician',
    name: A.name,
    honorificSuffix: A.credentials,
    medicalSpecialty: 'Gynecologic',
    identifier: [
      { '@type': 'PropertyValue', name: 'Karnataka Medical Council', value: A.kmc },
    ],
  },
  areaServed: [
    { '@type': 'City', name: 'Bengaluru' },
    { '@type': 'AdministrativeArea', name: 'Karnataka' },
    { '@type': 'Country', name: 'India' },
  ],
  sameAs: [A.siteUrl, A.instagram, A.facebook],
}

// ── Website schema ──────────────────────────────────────────────────────────
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Dr. Arti Sharma — Obstetrics & Gynaecology',
  description: 'Evidence-based obstetrics, gynaecology and cosmetic gynaecology blog by Dr. Arti Sharma, MBBS DNB. Bengaluru.',
  inLanguage: 'en-IN',
  publisher: {
    '@type': 'Person',
    name: A.name,
    url: A.siteUrl,
  },
}

export const artiConfig: SiteConfig = {
  key: 'arti',
  url: SITE_URL,

  author: {
    name: A.name,
    credentials: A.credentials,
    credentialsFull: A.credentialsFull,
    specialty: A.specialty,
    jobTitle: 'Obstetrician & Gynaecologist',
    practitionerNoun: 'gynaecologist',
    siteUrl: A.siteUrl,
    instagram: A.instagram,
    instagramHandle: '@sdrarti',
    training: A.training,
    knowsAbout: ['obstetrics', 'gynaecology', 'pregnancy care', 'PCOS', 'endometriosis', 'uterine fibroids', 'menstrual disorders', 'cosmetic gynaecology', 'vaginal rejuvenation'],
    credentialCategories: ['MBBS', 'DNB'],
    registrations: [
      { label: 'KMC Reg. No.', value: A.kmc },
    ],
  },

  theme: {
    cream: '#FBF6F3',    // soft cream background
    charcoal: '#4A2C3A', // deep plum text/headings
    olive: '#C9A227',    // muted gold — secondary accent (tags)
    rust: '#B76E79',     // dusty rose — primary accent, links, CTA
  },

  ui: {
    headerName: 'Dr. Arti Sharma',
    headerTagline: 'Obstetrics & Gynaecology',
    homeH1: "Women's Health Blog",
    homeSubtitle: 'Evidence-based articles on pregnancy, gynaecology and cosmetic gynaecology.',
    externalSiteLabel: 'drarti.in',
    consultCtaLabel: 'Book a consultation at drarti.in',
    ogHost: 'blog.drarti.in',
    ogSubtitle: `${A.name}, ${A.credentials} · Obstetrics & Gynaecology, Bengaluru`,
    ogGradientFrom: '#7A4A57',
    ogGradientTo: '#B76E79',
  },

  metadata: {
    title: {
      default: "Dr. Arti Sharma — Obstetrics, Gynaecology & Cosmetic Gynaecology Blog | Bengaluru",
      template: '%s | Dr. Arti Sharma',
    },
    description:
      'Evidence-based articles on pregnancy, gynaecology and cosmetic gynaecology by Dr. Arti Sharma, MBBS DNB — Obstetrician & Gynaecologist practising at Cloudnine Hospital, Docube Clinic and Aesthetica Veda in Bengaluru.',
    keywords: [
      'gynaecologist Bengaluru', 'obstetrician Bengaluru', 'PCOS treatment Bengaluru',
      'pregnancy care Sarjapur Road', 'cosmetic gynaecology Bengaluru', 'endometriosis Bengaluru',
      'uterine fibroids Bengaluru', 'best gynecologist Bangalore', 'Dr Arti Sharma',
      'vaginal rejuvenation Bengaluru', 'Cloudnine Sarjapur gynaecologist', 'women health Bangalore',
    ],
    openGraph: {
      siteName: 'Dr. Arti Sharma — Obstetrics & Gynaecology',
      locale: 'en_IN',
      type: 'website',
      url: SITE_URL,
    },
    twitter: {
      card: 'summary_large_image',
    },
    authors: [{ name: `${A.name}, ${A.credentials}`, url: A.siteUrl }],
    creator: A.name,
    publisher: 'Dr. Arti Sharma Medical Blog',
    alternates: {
      canonical: SITE_URL,
      languages: {
        'en-IN': SITE_URL,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  },

  blogListMetadata: {
    title: "Women's Health Blog — Obstetrics & Gynaecology",
    description:
      'Evidence-based educational articles on pregnancy, gynaecology and cosmetic gynaecology by Dr. Arti Sharma, MBBS DNB, Bengaluru.',
    alternates: { canonical: 'https://blog.drarti.in/blog' },
  },

  headerNav: [
    { label: 'Blog', href: '/' },
    { label: 'drarti.in ↗', href: A.siteUrl, external: true },
  ],

  footer: {
    locations: [
      {
        label: 'Bengaluru',
        entries: [
          { name: 'Cloudnine Hospital', detail: 'Sarjapur Road' },
          { name: 'Docube Clinic', detail: 'Doddakannelli' },
        ],
        phone: A.phone,
        regLine: `KMC Reg. No.: ${A.kmc}`,
      },
      {
        label: 'Cosmetic Gynaecology',
        entries: [{ name: 'Aesthetica Veda', detail: 'Koramangala' }],
        phone: A.cosmeticPhone,
      },
    ],
    links: [
      { label: 'Blog', href: '/' },
      { label: 'Instagram ↗', href: A.instagram, external: true },
      { label: 'drarti.in ↗', href: A.siteUrl, external: true },
    ],
  },

  sitemapStaticPages: [
    { path: '', changeFrequency: 'weekly', priority: 1 },
  ],

  layoutSchemas: [bengaluruSchema, websiteSchema],

  recognizingAuthority: {
    name: 'Federation of Obstetric and Gynaecological Societies of India (FOGSI)',
    url: 'https://www.fogsi.org',
  },

  postAuthorSchemas: (frontmatter, url) => {
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      headline: frontmatter.title,
      description: frontmatter.description,
      datePublished: frontmatter.date,
      dateModified: frontmatter.dateModified ?? frontmatter.date,
      url,
      author: {
        '@type': 'Physician',
        name: A.name,
        honorificSuffix: A.credentials,
        medicalSpecialty: A.specialty,
        affiliation: A.clinics.map((c) => ({
          '@type': 'MedicalOrganization',
          name: c.name,
          address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressCountry: 'IN' },
        })),
        identifier: [
          { '@type': 'PropertyValue', name: 'Karnataka Medical Council', value: A.kmc },
        ],
        url: A.siteUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Dr. Arti Sharma — Obstetrics & Gynaecology',
        url: A.siteUrl,
      },
      mainContentOfPage: { '@type': 'WebPageElement' },
    }

    const personSchema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: A.name,
      jobTitle: 'Obstetrician & Gynaecologist',
      description: `${A.credentials}. Obstetrician and gynaecologist practising in Bengaluru.`,
      url: A.siteUrl,
      sameAs: [A.siteUrl, A.instagram, A.facebook],
      knowsAbout: ['obstetrics', 'gynaecology', 'pregnancy care', 'PCOS', 'endometriosis', 'uterine fibroids', 'menstrual disorders', 'cosmetic gynaecology', 'vaginal rejuvenation'],
      alumniOf: A.training.map((t) => ({ '@type': 'CollegeOrUniversity', name: t })),
      hasCredential: ['MBBS', 'DNB'].map((c) => ({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: c,
      })),
      worksFor: A.clinics.map((c) => ({
        '@type': 'MedicalOrganization',
        name: c.name,
        address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressCountry: 'IN' },
      })),
    }

    return [articleSchema, personSchema]
  },

  llmsBody: (posts) => `# ${A.name} — Obstetrics & Gynaecology Blog

> ${SITE_URL}

## Purpose

This blog publishes factual, educational articles on obstetrics, gynaecology and cosmetic gynaecology, authored by ${A.name} (${A.credentials}). It is a content and authority asset for Dr. Arti Sharma's practice in Bengaluru.

## Author

- **Name:** ${A.name}, ${A.credentials}
- **Specialty:** ${A.specialty}
- **Registration:** Karnataka Medical Council — ${A.kmc}

### Bengaluru Practice
${A.clinics.map((c) => `- ${c.name}, ${c.location}`).join('\n')}
- Contact: ${A.phone}

### Training
${A.training.map((t) => `- ${t}`).join('\n')}

- **Main website:** ${A.siteUrl}
- **Instagram:** ${A.instagram}

## Blog Focus

Dr. Arti Sharma is an obstetrician and gynaecologist in Bengaluru. The blog covers:
- Pregnancy and antenatal care, normal and caesarean delivery
- PCOS, endometriosis, uterine fibroids and menstrual disorders
- Vaginitis and common gynaecological infections
- Cosmetic gynaecology (vaginal rejuvenation, hymenoplasty)
- Medical and surgical termination of pregnancy (MTP)
- Women's health, patient education and when to see a gynaecologist

## Content Policy

All articles are written for general educational purposes. They do not constitute medical advice and do not replace an in-person consultation with a qualified gynaecologist. A medical disclaimer is displayed on every post page. No patient testimonials or guaranteed outcomes are published.

## Posts

${posts.map((p) => `- [${p.frontmatter.title}](${SITE_URL}/blog/${p.slug})\n  ${p.frontmatter.description}`).join('\n\n')}
`,
}
