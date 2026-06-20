import { AUTHOR } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-navy-800 text-slate-400 mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-sm text-center space-y-1">
        <p>
          &copy; {new Date().getFullYear()} {AUTHOR.name}, {AUTHOR.credentials}.{' '}
          {AUTHOR.clinic}, {AUTHOR.city}.
        </p>
        <p>
          KMC Reg: {AUTHOR.kmc} &middot; DHA: {AUTHOR.dha}
        </p>
        <p>
          <a
            href={AUTHOR.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white transition-colors"
          >
            {AUTHOR.siteUrl.replace('https://', '')}
          </a>
        </p>
      </div>
    </footer>
  )
}
