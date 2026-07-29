import Link from 'next/link'
import { site } from '@/lib/site'

export default function Header() {
  return (
    <header className="bg-brand-cream border-b border-brand-charcoal/10 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/blog" className="flex flex-col min-w-0">
          <span className="text-base font-semibold text-brand-charcoal truncate">
            {site.ui.headerName}
          </span>
          <span className="text-xs text-brand-charcoal/50 uppercase tracking-wide hidden sm:block">
            {site.ui.headerTagline}
          </span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-5 text-sm shrink-0">
          {site.headerNav.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-rust hover:text-brand-charcoal font-medium transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`text-brand-charcoal/70 hover:text-brand-rust transition-colors${
                  link.hideOnMobile ? ' hidden sm:block' : ''
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  )
}
