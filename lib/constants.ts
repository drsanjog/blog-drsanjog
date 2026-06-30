export const SITE_URL = 'https://blog.drsanjog.com'

export const AUTHOR = {
  name: 'Dr. Sanjog Sharma',
  credentials: 'MBBS, MS, DNB',
  credentialsFull: 'MBBS, MS (General Surgery), DNB (Plastic Surgery)',
  specialty: 'Plastic and Cosmetic Surgery',
  yearsExperience: '10+',
  proceduresPerYear: '250+',

  // Primary practice — Dubai
  dubaiClinics: [
    { name: 'Cocoona Centre for Aesthetic Transformation', location: 'Al Wasl Road, Dubai' },
    { name: 'Emirates Hospital', location: 'Jumeirah, Dubai' },
    { name: 'Dubai London Hospital', location: 'Jumeirah, Dubai' },
  ],
  dubaiPhone: '+971 52 760 5797',

  // India practice
  clinic: 'Aesthetica Veda Clinic',
  clinicRole: 'Co-Founder',
  city: 'Whitefield, Bengaluru',
  bangalorePhone: '+91 99805 80792',

  // Registrations
  kmc: 'DLH 2020 0000540 KTK',
  dha: '24430721',

  // Training
  training: ['Lok Nayak Hospital, New Delhi', 'AIIMS New Delhi'],

  // Memberships
  apsi: 'Association of Plastic Surgeons of India (APSI) — Full Life Member',

  // Online presence
  siteUrl: 'https://drsanjog.com',
  instagram: 'https://www.instagram.com/dr.sanjog.sharma',
  linkedin: 'https://www.linkedin.com/in/dr-sanjog-sharma-4b4710323/',
} as const
