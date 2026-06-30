import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-brand-cream border-b border-brand-charcoal/10 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/blog" className="flex flex-col min-w-0">
          <span className="text-base font-semibold text-brand-charcoal truncate">
            Dr. Sanjog Sharma
          </span>
          <span className="text-xs text-brand-charcoal/50 uppercase tracking-wide hidden sm:block">
            Plastic &amp; Reconstructive Surgery
          </span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-5 text-sm shrink-0">
          <Link
            href="/"
            className="text-brand-charcoal/70 hover:text-brand-rust transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/blog/faq"
            className="text-brand-charcoal/70 hover:text-brand-rust transition-colors hidden sm:block"
          >
            FAQ
          </Link>
          <Link
            href="/blog/about"
            className="text-brand-charcoal/70 hover:text-brand-rust transition-colors"
          >
            About
          </Link>
          <a
            href="https://drsanjog.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-rust hover:text-brand-charcoal font-medium transition-colors"
          >
            drsanjog.com&nbsp;↗
          </a>
        </nav>
      </div>
    </header>
  )
}
