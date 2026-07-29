import type { SiteConfig } from '@/lib/site-config'

const SITE_URL = 'https://blog.drsanjog.com'

// ── Raw identity (superset used to build the schemas verbatim) ──────────────
const A = {
  name: 'Dr. Sanjog Sharma',
  credentials: 'MBBS, MS, DNB',
  credentialsFull: 'MBBS, MS (General Surgery), DNB (Plastic Surgery)',
  specialty: 'Plastic and Cosmetic Surgery',
  yearsExperience: '10+',
  proceduresPerYear: '250+',
  dubaiClinics: [
    { name: 'Cocoona Centre for Aesthetic Transformation', location: 'Al Wasl Road, Dubai' },
    { name: 'Emirates Hospital', location: 'Jumeirah, Dubai' },
    { name: 'Dubai London Hospital', location: 'Jumeirah, Dubai' },
  ],
  dubaiPhone: '+971 52 760 5797',
  clinic: 'Aesthetica Veda Clinic',
  clinicRole: 'Co-Founder',
  city: 'Whitefield, Bengaluru',
  bangalorePhone: '+91 99805 80792',
  kmc: 'DLH 2020 0000540 KTK',
  dha: '24430721',
  training: ['Lok Nayak Hospital, New Delhi', 'AIIMS New Delhi'],
  apsi: 'Association of Plastic Surgeons of India (APSI) — Full Life Member',
  siteUrl: 'https://drsanjog.com',
  instagram: 'https://www.instagram.com/dr.sanjog.sharma',
  linkedin: 'https://www.linkedin.com/in/dr-sanjog-sharma-4b4710323/',
}

// ── LocalBusiness schema — Bengaluru (verbatim from app/layout.tsx) ─────────
const bengaluruSchema = {
  '@context': 'https://schema.org',
  '@type': ['MedicalBusiness', 'LocalBusiness'],
  '@id': `${SITE_URL}/#bengaluru-clinic`,
  name: 'Aesthetica Veda Clinic — Dr. Sanjog Sharma',
  url: A.siteUrl,
  description:
    'Plastic and cosmetic surgery practice in Whitefield, Bengaluru, co-founded by Dr. Sanjog Sharma (MBBS, MS, DNB). Specialising in VASER liposuction, tummy tuck, mommy makeover, body contouring after GLP-1 weight loss, and post-bariatric procedures.',
  telephone: A.bangalorePhone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Whitefield',
    addressLocality: 'Whitefield',
    addressRegion: 'Karnataka',
    postalCode: '560066',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 12.9698,
    longitude: 77.751,
  },
  hasMap: 'https://maps.app.goo.gl/X4SSFU4FTGvVEKMT7',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '19:00',
    },
  ],
  priceRange: '₹₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, Debit Card, Bank Transfer, Insurance',
  medicalSpecialty: ['Plastic Surgery', 'Cosmetic Surgery', 'Body Contouring', 'Reconstructive Surgery'],
  availableService: [
    { '@type': 'MedicalTherapy', 'name': 'VASER Liposuction' },
    { '@type': 'MedicalTherapy', 'name': 'High-Definition Liposuction (HD Lipo)' },
    { '@type': 'MedicalTherapy', 'name': 'Tummy Tuck (Abdominoplasty)' },
    { '@type': 'MedicalTherapy', 'name': 'Mommy Makeover' },
    { '@type': 'MedicalTherapy', 'name': 'Brazilian Butt Lift (BBL)' },
    { '@type': 'MedicalTherapy', 'name': 'Arm Lift (Brachioplasty)' },
    { '@type': 'MedicalTherapy', 'name': 'Thigh Lift' },
    { '@type': 'MedicalTherapy', 'name': 'Gynecomastia Surgery' },
    { '@type': 'MedicalTherapy', 'name': 'Body Contouring After GLP-1 Weight Loss' },
    { '@type': 'MedicalTherapy', 'name': 'Post-Bariatric Body Contouring' },
    { '@type': 'MedicalTherapy', 'name': 'Rhinoplasty' },
  ],
  staff: {
    '@type': 'Physician',
    name: A.name,
    honorificSuffix: A.credentials,
    medicalSpecialty: 'Plastic Surgery',
    identifier: [
      { '@type': 'PropertyValue', name: 'KMC Registration', value: A.kmc },
    ],
  },
  areaServed: [
    { '@type': 'City', name: 'Bengaluru' },
    { '@type': 'AdministrativeArea', name: 'Karnataka' },
    { '@type': 'Country', name: 'India' },
  ],
  sameAs: [A.siteUrl, A.instagram, A.linkedin],
}

// ── LocalBusiness schema — Dubai (verbatim from app/layout.tsx) ─────────────
const dubaiSchema = {
  '@context': 'https://schema.org',
  '@type': ['MedicalBusiness', 'LocalBusiness'],
  '@id': `${SITE_URL}/#dubai-practice`,
  name: 'Dr. Sanjog Sharma — Plastic & Cosmetic Surgery Dubai',
  description:
    'Dr. Sanjog Sharma (MBBS, MS, DNB) is a DHA-licensed plastic and cosmetic surgeon practising at Cocoona Centre for Aesthetic Transformation, Emirates Hospital, and Dubai London Hospital in Dubai.',
  telephone: A.dubaiPhone,
  medicalSpecialty: ['Plastic Surgery', 'Cosmetic Surgery', 'Body Contouring'],
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    name: 'Dubai Health Authority Medical Licence',
    credentialCategory: 'Medical Licence',
    recognizedBy: { '@type': 'Organization', name: 'Dubai Health Authority' },
    identifier: A.dha,
  },
  location: A.dubaiClinics.map((c) => ({
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
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '09:00',
      closes: '14:00',
    },
  ],
  priceRange: 'AED AED AED',
  currenciesAccepted: 'AED',
  availableService: [
    { '@type': 'MedicalTherapy', name: 'VASER Liposuction' },
    { '@type': 'MedicalTherapy', name: 'High-Definition Liposuction (HD Lipo)' },
    { '@type': 'MedicalTherapy', name: 'Tummy Tuck (Abdominoplasty)' },
    { '@type': 'MedicalTherapy', name: 'Body Contouring After GLP-1 Weight Loss' },
    { '@type': 'MedicalTherapy', name: 'Post-Bariatric Body Contouring' },
    { '@type': 'MedicalTherapy', name: 'Brazilian Butt Lift (BBL)' },
    { '@type': 'MedicalTherapy', name: 'Rhinoplasty for South Asian Patients' },
  ],
  areaServed: [
    { '@type': 'City', name: 'Dubai' },
    { '@type': 'Country', name: 'United Arab Emirates' },
  ],
  sameAs: [A.siteUrl, A.instagram, A.linkedin],
}

// ── Website schema (verbatim from app/layout.tsx) ───────────────────────────
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Dr. Sanjog Sharma — Plastic & Cosmetic Surgery',
  description: 'Evidence-based plastic surgery blog by Dr. Sanjog Sharma, MBBS MS DNB. Dubai and Bengaluru.',
  inLanguage: 'en-IN',
  publisher: {
    '@type': 'Person',
    name: A.name,
    url: A.siteUrl,
  },
}

export const sanjogConfig: SiteConfig = {
  key: 'sanjog',
  url: SITE_URL,

  author: {
    name: A.name,
    credentials: A.credentials,
    credentialsFull: A.credentialsFull,
    specialty: A.specialty,
    jobTitle: 'Plastic and Reconstructive Surgeon',
    practitionerNoun: 'surgeon',
    siteUrl: A.siteUrl,
    instagram: A.instagram,
    instagramHandle: '@dr.sanjog.sharma',
    linkedin: A.linkedin,
    training: A.training,
    knowsAbout: ['plastic surgery', 'cosmetic surgery', 'body contouring', 'reconstructive surgery', 'fat transfer', 'rhinoplasty', 'liposuction'],
    credentialCategories: ['MBBS', 'MS', 'DNB'],
    membershipOrg: 'Association of Plastic Surgeons of India (APSI)',
    membershipLine: A.apsi,
    registrations: [
      { label: 'KMC', value: A.kmc },
      { label: 'DHA License', value: A.dha },
    ],
  },

  theme: {
    cream: '#F5F0E8',
    charcoal: '#1C1C1C',
    olive: '#4A5240',
    rust: '#C4622D',
  },

  ui: {
    headerName: 'Dr. Sanjog Sharma',
    headerTagline: 'Plastic & Reconstructive Surgery',
    homeH1: 'Medical Blog',
    homeSubtitle: 'Evidence-based articles on plastic and reconstructive surgery.',
    externalSiteLabel: 'drsanjog.com',
    consultCtaLabel: 'Book a consultation at drsanjog.com',
    ogHost: 'blog.drsanjog.com',
    ogSubtitle: `${A.name}, ${A.credentials} · ${A.clinic}, ${A.city}`,
    ogGradientFrom: '#1e3a5f',
    ogGradientTo: '#1d4ed8',
  },

  metadata: {
    title: {
      default: 'Dr. Sanjog Sharma — Plastic & Cosmetic Surgery Blog | Dubai & Bengaluru',
      template: '%s | Dr. Sanjog Sharma',
    },
    description:
      'Evidence-based articles on plastic and cosmetic surgery by Dr. Sanjog Sharma, MBBS MS DNB — practising at Cocoona Centre, Emirates Hospital, and Dubai London Hospital in Dubai, and Aesthetica Veda Clinic, Bengaluru.',
    keywords: [
      'plastic surgery Bengaluru', 'cosmetic surgery Dubai', 'liposuction Whitefield',
      'body contouring Bengaluru', 'VASER liposuction Dubai', 'tummy tuck Bengaluru',
      'plastic surgeon Dubai', 'Dr Sanjog Sharma', 'Aesthetica Veda Clinic',
      'Cocoona Centre Dubai', 'plastic surgery NRI India', 'body contouring after Ozempic',
    ],
    openGraph: {
      siteName: 'Dr. Sanjog Sharma — Plastic & Cosmetic Surgery',
      locale: 'en_IN',
      alternateLocale: ['en_AE', 'en_GB', 'en_US'],
      type: 'website',
      url: SITE_URL,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@drsanjog',
    },
    authors: [{ name: `${A.name}, ${A.credentials}`, url: A.siteUrl }],
    creator: A.name,
    publisher: 'Dr. Sanjog Sharma Medical Blog',
    alternates: {
      canonical: SITE_URL,
      languages: {
        'en-IN': SITE_URL,
        'en-AE': SITE_URL,
        'en-GB': SITE_URL,
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
    verification: {
      google: 'cviaiqRotEfiM6FIhZaEBOJtViHw75LWX4i2-FAyVnk',
    },
  },

  blogListMetadata: {
    title: 'Medical Blog — Plastic & Reconstructive Surgery',
    description:
      'Evidence-based educational articles on plastic and reconstructive surgery by Dr. Sanjog Sharma, MS DNB, Aesthetica Veda Clinic, Bengaluru.',
    alternates: { canonical: 'https://blog.drsanjog.com/blog' },
  },

  headerNav: [
    { label: 'Blog', href: '/' },
    { label: 'FAQ', href: '/blog/faq', hideOnMobile: true },
    { label: 'About', href: '/blog/about' },
    { label: 'drsanjog.com ↗', href: 'https://drsanjog.com', external: true },
  ],

  footer: {
    locations: [
      {
        label: 'Dubai',
        entries: A.dubaiClinics.map((c) => ({ name: c.name, detail: c.location })),
        phone: A.dubaiPhone,
        regLine: `DHA Licence: ${A.dha}`,
      },
      {
        label: 'Bengaluru',
        entries: [{ name: A.clinic }, { name: A.city }],
        phone: A.bangalorePhone,
        regLine: `KMC: ${A.kmc}`,
      },
    ],
    links: [
      { label: 'Blog', href: '/' },
      { label: 'About', href: '/blog/about' },
      { label: 'Bengaluru', href: '/blog/plastic-surgery-bengaluru' },
      { label: 'Dubai', href: '/blog/cosmetic-surgery-dubai' },
      { label: 'FAQ', href: '/blog/faq' },
      { label: 'Instagram ↗', href: A.instagram, external: true },
      { label: 'drsanjog.com ↗', href: A.siteUrl, external: true },
    ],
  },

  sitemapStaticPages: [
    { path: '', changeFrequency: 'weekly', priority: 1 },
    { path: '/blog/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/blog/plastic-surgery-bengaluru', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/blog/cosmetic-surgery-dubai', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/blog/faq', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/blog/body-contouring', changeFrequency: 'weekly', priority: 0.9 },
  ],

  layoutSchemas: [bengaluruSchema, dubaiSchema, websiteSchema],

  recognizingAuthority: {
    name: 'International Society of Aesthetic Plastic Surgery (ISAPS)',
    url: 'https://www.isaps.org',
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
        affiliation: [
          ...A.dubaiClinics.map((c) => ({
            '@type': 'MedicalOrganization',
            name: c.name,
            address: { '@type': 'PostalAddress', addressLocality: c.location, addressCountry: 'AE' },
          })),
          {
            '@type': 'MedicalOrganization',
            name: A.clinic,
            address: { '@type': 'PostalAddress', addressLocality: A.city, addressCountry: 'IN' },
          },
        ],
        identifier: [
          { '@type': 'PropertyValue', name: 'Karnataka Medical Council', value: A.kmc },
          { '@type': 'PropertyValue', name: 'DHA License', value: A.dha },
        ],
        url: A.siteUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: A.clinic,
        url: A.siteUrl,
      },
      mainContentOfPage: { '@type': 'WebPageElement' },
    }

    const personSchema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: A.name,
      jobTitle: 'Plastic and Reconstructive Surgeon',
      description: `${A.credentials}. Plastic and cosmetic surgeon practising in Dubai and Bengaluru.`,
      url: A.siteUrl,
      sameAs: [A.siteUrl, A.instagram, A.linkedin],
      knowsAbout: ['plastic surgery', 'cosmetic surgery', 'body contouring', 'reconstructive surgery', 'fat transfer', 'rhinoplasty', 'liposuction'],
      alumniOf: A.training.map((t) => ({ '@type': 'CollegeOrUniversity', name: t })),
      memberOf: { '@type': 'Organization', name: 'Association of Plastic Surgeons of India (APSI)' },
      hasCredential: ['MBBS', 'MS', 'DNB'].map((c) => ({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: c,
      })),
      worksFor: [
        ...A.dubaiClinics.map((c) => ({
          '@type': 'MedicalOrganization',
          name: c.name,
          address: { '@type': 'PostalAddress', addressLocality: c.location, addressCountry: 'AE' },
        })),
        {
          '@type': 'MedicalOrganization',
          name: A.clinic,
          address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressCountry: 'IN' },
        },
      ],
    }

    return [articleSchema, personSchema]
  },

  llmsBody: (posts) => `# ${A.name} — Medical Blog

> ${SITE_URL}

## Purpose

This blog publishes factual, educational articles on plastic and cosmetic surgery, authored by ${A.name} (${A.credentials}). It is a content and authority asset for Dr. Sharma's international practice spanning Dubai and Bengaluru.

## Author

- **Name:** ${A.name}, ${A.credentials}
- **Specialty:** ${A.specialty}
- **Experience:** ${A.yearsExperience} years | ${A.proceduresPerYear} procedures/year
- **Membership:** ${A.apsi}

### Dubai Practice (Primary)
${A.dubaiClinics.map((c) => `- ${c.name}, ${c.location}`).join('\n')}
- DHA License: ${A.dha}
- Dubai contact: ${A.dubaiPhone}

### Bengaluru Practice (Selective Visits)
- ${A.clinicRole}, ${A.clinic}, ${A.city}
- Karnataka Medical Council: ${A.kmc}
- India contact: ${A.bangalorePhone}

### Training
${A.training.map((t) => `- ${t}`).join('\n')}

- **Main website:** ${A.siteUrl}
- **Instagram:** ${A.instagram}
- **LinkedIn:** ${A.linkedin}

## Blog Focus

Dr. Sharma is an internationally practising plastic surgeon based in Dubai who performs selected complex body contouring cases for patients in Bengaluru. The blog covers:
- VASER liposuction and high-definition liposuction
- Body contouring after GLP-1 (Ozempic/Wegovy) weight loss
- Post-bariatric body contouring
- Tummy tuck, mommy makeover, arm lift, thigh lift
- Brazilian Butt Lift (BBL)
- Gynecomastia surgery
- Rhinoplasty and facial procedures
- Patient selection, recovery, and safety

## Content Policy

All articles are written for general educational purposes. They do not constitute medical advice and do not replace an in-person consultation with a qualified surgeon. A medical disclaimer is displayed on every post page. No patient testimonials, before/after images, or guaranteed outcomes are published (NMC India compliance).

## Posts

${posts.map((p) => `- [${p.frontmatter.title}](${SITE_URL}/blog/${p.slug})\n  ${p.frontmatter.description}`).join('\n\n')}

## Additional Pages

- [About Dr. Sanjog Sharma](${SITE_URL}/blog/about) — Full credentials, Dubai and Bengaluru practice details, training, and registrations
`,
}
