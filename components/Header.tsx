import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/blog" className="flex flex-col min-w-0">
          <span className="text-base font-semibold text-slate-900 truncate">
            Dr. Sanjog Sharma
          </span>
          <span className="text-xs text-slate-500 uppercase tracking-wide hidden sm:block">
            Plastic &amp; Reconstructive Surgery
          </span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6 text-sm shrink-0">
          <Link
            href="/blog"
            className="text-slate-600 hover:text-blue-700 transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/blog/about"
            className="text-slate-600 hover:text-blue-700 transition-colors"
          >
            About
          </Link>
          <a
            href="https://drsanjog.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900 font-medium transition-colors"
          >
            drsanjog.com&nbsp;↗
          </a>
        </nav>
      </div>
    </header>
  )
}
