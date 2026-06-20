import { AUTHOR } from '@/lib/constants'

export default function MedicalDisclaimer() {
  return (
    <div
      role="note"
      className="mt-10 p-4 bg-brand-rust/10 border border-brand-rust/20 rounded-lg text-sm text-brand-charcoal leading-relaxed"
    >
      <strong>Medical Disclaimer:</strong> This article is for general
      educational purposes and does not replace an in-person medical
      consultation. For personal assessment, consult a qualified surgeon.{' '}
      <a
        href={AUTHOR.siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-medium hover:text-brand-rust transition-colors"
      >
        Book a consultation at drsanjog.com
      </a>
      .
    </div>
  )
}
