import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import { site } from '@/lib/site'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  ...site.metadata,
}

// Sanjog uses the default palette baked into globals.css, so no override is
// emitted and his HTML is unchanged. Other sites override the four brand
// variables at :root, re-theming every `brand-*` class.
const themeOverride =
  site.key === 'sanjog'
    ? null
    : `:root{--brand-cream:${site.theme.cream};--brand-charcoal:${site.theme.charcoal};--brand-olive:${site.theme.olive};--brand-rust:${site.theme.rust};}`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-brand-cream text-brand-charcoal min-h-screen flex flex-col`}
      >
        {themeOverride && (
          <style dangerouslySetInnerHTML={{ __html: themeOverride }} />
        )}
        {site.layoutSchemas.map((schema, i) => (
          <JsonLd key={i} data={schema} />
        ))}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
