import Link from 'next/link'
import { AUTHOR } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal text-brand-cream/60 mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* Location columns */}
        <div className="grid sm:grid-cols-2 gap-8 mb-8 text-sm">
          <div>
            <p className="text-brand-cream/30 text-xs uppercase tracking-widest mb-3">Dubai</p>
            <ul className="space-y-1.5">
              {AUTHOR.dubaiClinics.map((c) => (
                <li key={c.name}>
                  <span className="text-brand-cream/80">{c.name}</span>
                  <span className="text-brand-cream/40 ml-1">— {c.location}</span>
                </li>
              ))}
              <li className="pt-1">
                <a
                  href={`tel:${AUTHOR.dubaiPhone.replace(/\s/g, '')}`}
                  className="text-brand-cream/60 hover:text-brand-cream transition-colors"
                >
                  {AUTHOR.dubaiPhone}
                </a>
              </li>
              <li>
                <span className="text-brand-cream/40 text-xs">DHA Licence: {AUTHOR.dha}</span>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-brand-cream/30 text-xs uppercase tracking-widest mb-3">Bengaluru</p>
            <ul className="space-y-1.5">
              <li>
                <span className="text-brand-cream/80">{AUTHOR.clinic}</span>
              </li>
              <li className="text-brand-cream/60">{AUTHOR.city}</li>
              <li>
                <a
                  href={`tel:${AUTHOR.bangalorePhone.replace(/\s/g, '')}`}
                  className="text-brand-cream/60 hover:text-brand-cream transition-colors"
                >
                  {AUTHOR.bangalorePhone}
                </a>
              </li>
              <li>
                <span className="text-brand-cream/40 text-xs">KMC: {AUTHOR.kmc}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Nav links */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm mb-6 border-t border-brand-cream/10 pt-6">
          <Link href="/" className="text-brand-cream/50 hover:text-brand-cream transition-colors">Blog</Link>
          <Link href="/blog/about" className="text-brand-cream/50 hover:text-brand-cream transition-colors">About</Link>
          <Link href="/blog/plastic-surgery-bengaluru" className="text-brand-cream/50 hover:text-brand-cream transition-colors">Bengaluru</Link>
          <Link href="/blog/cosmetic-surgery-dubai" className="text-brand-cream/50 hover:text-brand-cream transition-colors">Dubai</Link>
          <Link href="/blog/faq" className="text-brand-cream/50 hover:text-brand-cream transition-colors">FAQ</Link>
          <a
            href={AUTHOR.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-cream/50 hover:text-brand-cream transition-colors"
          >
            Instagram ↗
          </a>
          <a
            href={AUTHOR.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-cream/50 hover:text-brand-cream transition-colors"
          >
            drsanjog.com ↗
          </a>
        </div>

        {/* Legal */}
        <div className="text-xs text-brand-cream/30 space-y-1">
          <p>
            &copy; {new Date().getFullYear()} {AUTHOR.name}, {AUTHOR.credentialsFull}.
            {' '}Content is for educational purposes and does not constitute medical advice.
          </p>
          <p>{AUTHOR.apsi}</p>
        </div>
      </div>
    </footer>
  )
}
