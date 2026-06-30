import { AUTHOR } from '@/lib/constants'

export default function AuthorBio() {
  return (
    <aside className="mt-12 p-6 bg-brand-cream rounded-xl border border-brand-charcoal/10">
      <p className="text-xs uppercase tracking-widest text-brand-charcoal/40 mb-3">
        About the Author
      </p>
      <p className="font-semibold text-brand-charcoal">
        {AUTHOR.name}, {AUTHOR.credentials}
      </p>
      <p className="text-sm text-brand-rust mt-0.5">{AUTHOR.specialty}</p>

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/40 mb-1.5">
            Dubai, UAE
          </p>
          <ul className="space-y-0.5">
            {AUTHOR.dubaiClinics.map((c) => (
              <li key={c.name} className="text-xs text-brand-charcoal/75">
                {c.name}, {c.location}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/40 mb-1.5">
            Bengaluru, India
          </p>
          <p className="text-xs text-brand-charcoal/75">
            {AUTHOR.clinicRole}, {AUTHOR.clinic}, {AUTHOR.city}
          </p>
        </div>
      </div>

      <dl className="mt-4 text-xs text-brand-charcoal/50 space-y-1">
        <div className="flex flex-wrap gap-x-1">
          <dt className="font-medium text-brand-charcoal/70">KMC:</dt>
          <dd>{AUTHOR.kmc}</dd>
        </div>
        <div className="flex flex-wrap gap-x-1">
          <dt className="font-medium text-brand-charcoal/70">DHA License:</dt>
          <dd>{AUTHOR.dha}</dd>
        </div>
        <div className="flex flex-wrap gap-x-1">
          <dt className="font-medium text-brand-charcoal/70">Training:</dt>
          <dd>{(AUTHOR.training as readonly string[]).join(' · ')}</dd>
        </div>
        <div className="flex flex-wrap gap-x-1">
          <dt className="font-medium text-brand-charcoal/70">Membership:</dt>
          <dd>APSI Full Life Member</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center gap-4">
        <a
          href={AUTHOR.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-brand-rust hover:text-brand-charcoal underline transition-colors"
        >
          Visit drsanjog.com →
        </a>
        <a
          href={AUTHOR.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-brand-charcoal/60 hover:text-brand-rust transition-colors"
        >
          @dr.sanjog.sharma ↗
        </a>
      </div>
    </aside>
  )
}
