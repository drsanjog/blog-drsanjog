import { site } from '@/lib/site'

export default function AuthorBio() {
  const { author, footer, ui } = site

  return (
    <aside className="mt-12 p-6 bg-brand-cream rounded-xl border border-brand-charcoal/10">
      <p className="text-xs uppercase tracking-widest text-brand-charcoal/40 mb-3">
        About the Author
      </p>
      <p className="font-semibold text-brand-charcoal">
        {author.name}, {author.credentials}
      </p>
      <p className="text-sm text-brand-rust mt-0.5">{author.specialty}</p>

      <div className="mt-4 space-y-3">
        {footer.locations.map((loc) => (
          <div key={loc.label}>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/40 mb-1.5">
              {loc.label}
            </p>
            <ul className="space-y-0.5">
              {loc.entries.map((e) => (
                <li key={e.name} className="text-xs text-brand-charcoal/75">
                  {e.detail ? `${e.name}, ${e.detail}` : e.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <dl className="mt-4 text-xs text-brand-charcoal/50 space-y-1">
        {(author.registrations ?? []).map((reg) => (
          <div key={reg.label} className="flex flex-wrap gap-x-1">
            <dt className="font-medium text-brand-charcoal/70">{reg.label}:</dt>
            <dd>{reg.value}</dd>
          </div>
        ))}
        <div className="flex flex-wrap gap-x-1">
          <dt className="font-medium text-brand-charcoal/70">Training:</dt>
          <dd>{author.training.join(' · ')}</dd>
        </div>
        {author.membershipOrg && (
          <div className="flex flex-wrap gap-x-1">
            <dt className="font-medium text-brand-charcoal/70">Membership:</dt>
            <dd>{author.membershipOrg}</dd>
          </div>
        )}
      </dl>

      <div className="mt-5 flex items-center gap-4">
        <a
          href={author.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-brand-rust hover:text-brand-charcoal underline transition-colors"
        >
          Visit {ui.externalSiteLabel} →
        </a>
        <a
          href={author.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-brand-charcoal/60 hover:text-brand-rust transition-colors"
        >
          {author.instagramHandle} ↗
        </a>
      </div>
    </aside>
  )
}
