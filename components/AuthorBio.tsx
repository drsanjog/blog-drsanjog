import { AUTHOR } from '@/lib/constants'

export default function AuthorBio() {
  return (
    <aside className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200">
      <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">
        About the Author
      </p>
      <p className="font-semibold text-slate-900">
        {AUTHOR.name}, {AUTHOR.credentials}
      </p>
      <p className="text-sm text-blue-700 mt-0.5">{AUTHOR.specialty}</p>
      <p className="text-sm text-slate-600">
        {AUTHOR.clinic}, {AUTHOR.city}
      </p>

      <dl className="mt-4 text-xs text-slate-500 space-y-1">
        <div className="flex flex-wrap gap-x-1">
          <dt className="font-medium text-slate-600">
            Karnataka Medical Council:
          </dt>
          <dd>{AUTHOR.kmc}</dd>
        </div>
        <div className="flex flex-wrap gap-x-1">
          <dt className="font-medium text-slate-600">DHA License:</dt>
          <dd>{AUTHOR.dha}</dd>
        </div>
        <div className="flex flex-wrap gap-x-1">
          <dt className="font-medium text-slate-600">Training:</dt>
          <dd>{AUTHOR.training.join(' · ')}</dd>
        </div>
      </dl>

      <a
        href={AUTHOR.siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-block text-sm font-medium text-blue-700 hover:text-blue-900 underline transition-colors"
      >
        Visit drsanjog.com →
      </a>
    </aside>
  )
}
