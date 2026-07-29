import Link from 'next/link'
import { site } from '@/lib/site'

export default function Footer() {
  const { author, footer, ui } = site

  return (
    <footer className="bg-brand-charcoal text-brand-cream/60 mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* Location columns */}
        <div className="grid sm:grid-cols-2 gap-8 mb-8 text-sm">
          {footer.locations.map((loc) => (
            <div key={loc.label}>
              <p className="text-brand-cream/30 text-xs uppercase tracking-widest mb-3">
                {loc.label}
              </p>
              <ul className="space-y-1.5">
                {loc.entries.map((e) => (
                  <li key={e.name}>
                    <span className="text-brand-cream/80">{e.name}</span>
                    {e.detail && (
                      <span className="text-brand-cream/40 ml-1">— {e.detail}</span>
                    )}
                  </li>
                ))}
                {loc.phone && (
                  <li className="pt-1">
                    <a
                      href={`tel:${loc.phone.replace(/\s/g, '')}`}
                      className="text-brand-cream/60 hover:text-brand-cream transition-colors"
                    >
                      {loc.phone}
                    </a>
                  </li>
                )}
                {loc.regLine && (
                  <li>
                    <span className="text-brand-cream/40 text-xs">{loc.regLine}</span>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Nav links */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm mb-6 border-t border-brand-cream/10 pt-6">
          {footer.links.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-cream/50 hover:text-brand-cream transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-brand-cream/50 hover:text-brand-cream transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Legal */}
        <div className="text-xs text-brand-cream/30 space-y-1">
          <p>
            &copy; {new Date().getFullYear()} {author.name}, {author.credentialsFull}.
            {' '}Content is for educational purposes and does not constitute medical advice.
          </p>
          {author.membershipLine && <p>{author.membershipLine}</p>}
        </div>
      </div>
    </footer>
  )
}
