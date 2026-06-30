import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import { AUTHOR, SITE_URL } from '@/lib/constants'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
  authors: [{ name: `${AUTHOR.name}, ${AUTHOR.credentials}`, url: AUTHOR.siteUrl }],
  creator: AUTHOR.name,
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
}

// ─── Req 1: LocalBusiness schema — Bengaluru ────────────────────────────────
const bengaluruSchema = {
  '@context': 'https://schema.org',
  '@type': ['MedicalBusiness', 'LocalBusiness'],
  '@id': `${SITE_URL}/#bengaluru-clinic`,
  name: 'Aesthetica Veda Clinic — Dr. Sanjog Sharma',
  url: AUTHOR.siteUrl,
  description:
    'Plastic and cosmetic surgery practice in Whitefield, Bengaluru, co-founded by Dr. Sanjog Sharma (MBBS, MS, DNB). Specialising in VASER liposuction, tummy tuck, mommy makeover, body contouring after GLP-1 weight loss, and post-bariatric procedures.',
  telephone: AUTHOR.bangalorePhone,
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
    name: AUTHOR.name,
    honorificSuffix: AUTHOR.credentials,
    medicalSpecialty: 'Plastic Surgery',
    identifier: [
      { '@type': 'PropertyValue', name: 'KMC Registration', value: AUTHOR.kmc },
    ],
  },
  areaServed: [
    { '@type': 'City', name: 'Bengaluru' },
    { '@type': 'AdministrativeArea', name: 'Karnataka' },
    { '@type': 'Country', name: 'India' },
  ],
  sameAs: [AUTHOR.siteUrl, AUTHOR.instagram, AUTHOR.linkedin],
}

// ─── Req 1: LocalBusiness schema — Dubai ────────────────────────────────────
const dubaiSchema = {
  '@context': 'https://schema.org',
  '@type': ['MedicalBusiness', 'LocalBusiness'],
  '@id': `${SITE_URL}/#dubai-practice`,
  name: 'Dr. Sanjog Sharma — Plastic & Cosmetic Surgery Dubai',
  description:
    'Dr. Sanjog Sharma (MBBS, MS, DNB) is a DHA-licensed plastic and cosmetic surgeon practising at Cocoona Centre for Aesthetic Transformation, Emirates Hospital, and Dubai London Hospital in Dubai.',
  telephone: AUTHOR.dubaiPhone,
  medicalSpecialty: ['Plastic Surgery', 'Cosmetic Surgery', 'Body Contouring'],
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    name: 'Dubai Health Authority Medical Licence',
    credentialCategory: 'Medical Licence',
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
  sameAs: [AUTHOR.siteUrl, AUTHOR.instagram, AUTHOR.linkedin],
}

// ─── Website + Sitelinks Search schema ──────────────────────────────────────
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
    name: AUTHOR.name,
    url: AUTHOR.siteUrl,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-brand-cream text-brand-charcoal min-h-screen flex flex-col`}
      >
        <JsonLd data={bengaluruSchema} />
        <JsonLd data={dubaiSchema} />
        <JsonLd data={websiteSchema} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
