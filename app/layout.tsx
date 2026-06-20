import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://blog.drsanjog.com'),
  title: {
    default: 'Dr. Sanjog Sharma — Plastic Surgery Blog',
    template: '%s | Dr. Sanjog Sharma',
  },
  description:
    'Evidence-based articles on plastic and reconstructive surgery by Dr. Sanjog Sharma, MS DNB — Aesthetica Veda Clinic, Bengaluru.',
  openGraph: {
    siteName: 'Dr. Sanjog Sharma Medical Blog',
    locale: 'en_IN',
    type: 'website',
  },
  authors: [{ name: 'Dr. Sanjog Sharma, MS DNB' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-brand-cream text-brand-charcoal min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
