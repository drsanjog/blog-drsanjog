import { site } from '@/lib/site'

export default function MedicalDisclaimer({ reviewedDate }: { reviewedDate?: string }) {
  const { author, ui } = site
  const dateStr = reviewedDate
    ? new Date(reviewedDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div
      role="note"
      className="mt-10 p-4 bg-brand-rust/10 border border-brand-rust/20 rounded-lg text-sm text-brand-charcoal leading-relaxed"
    >
      <strong>Medical Disclaimer:</strong> This article is for general educational purposes only
      and does not constitute medical advice or replace an in-person consultation with a qualified
      {' '}{author.practitionerNoun}. Medically reviewed by {author.name}, {author.credentials} on {dateStr}.{' '}
      <a
        href={author.siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-medium hover:text-brand-rust transition-colors"
      >
        {ui.consultCtaLabel}
      </a>
      .
    </div>
  )
}
