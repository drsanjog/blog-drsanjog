import type { Metadata } from 'next'
import { AUTHOR, SITE_URL } from '@/lib/constants'
import JsonLd from '@/components/JsonLd'
import Breadcrumb from '@/components/Breadcrumb'

const PAGE_URL = `${SITE_URL}/blog/faq`

export const metadata: Metadata = {
  title: 'Plastic Surgery FAQ | Dr. Sanjog Sharma — Dubai & Bengaluru',
  description:
    'Answers to the most common patient questions about liposuction, tummy tuck, VASER liposuction, mommy makeover, and body contouring — by Dr. Sanjog Sharma, MBBS MS DNB, practising in Dubai and Bengaluru.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Plastic Surgery FAQ | Dr. Sanjog Sharma',
    description: 'Common patient questions about liposuction, tummy tuck, VASER, and body contouring answered by a DHA-licensed plastic surgeon.',
    url: PAGE_URL,
    type: 'website',
  },
}

const FAQS = [
  {
    question: 'What is the difference between liposuction and a tummy tuck?',
    answer:
      'Liposuction removes localised fat deposits through small cannulas — it does not address loose or redundant skin. A tummy tuck (abdominoplasty) removes excess abdominal skin and tightens the underlying muscle fascia, and often includes some fat removal. Many patients benefit from both: liposuction to refine fat distribution, and abdominoplasty to address skin laxity and muscle separation. The correct choice depends on skin quality, the degree of rectus diastasis, and whether the primary concern is fat volume or skin excess. This can only be determined at an in-person clinical assessment.',
  },
  {
    question: 'How long does VASER liposuction recovery take?',
    answer:
      'Most patients return to light daily activity within 5–7 days and to desk work within 10–14 days. Compression garments are worn continuously for 4–6 weeks. Swelling resolves progressively over 3–6 months — the final result is typically visible at 3 months for most body areas. High-definition VASER patients may take longer to see full muscular definition as deeper swelling resolves. Strenuous exercise is restricted for 4–6 weeks.',
  },
  {
    question: 'Who is a good candidate for liposuction?',
    answer:
      'An ideal liposuction candidate is within 25–30% of their target body weight, has good skin elasticity, and has localised fat deposits that have not responded to diet and exercise. Liposuction is not a weight-loss procedure and is not suitable for patients with poor skin tone — it will not improve loose skin and may worsen its appearance. Candidates should be non-smokers, free of active medical conditions that impair healing, and have realistic expectations about the outcome.',
  },
  {
    question: 'What is included in a mommy makeover?',
    answer:
      'A mommy makeover is a customised combination of procedures that addresses post-pregnancy body changes. It typically includes abdominoplasty (tummy tuck) for loose skin and rectus diastasis, liposuction for body contouring, and a breast procedure — most commonly a breast lift with or without augmentation. Some patients also include arm lift, thigh lift, or labiaplasty. Procedures may be combined in a single session where safe (usually within a 6-hour operating limit), or staged across two operations spaced 3–6 months apart.',
  },
  {
    question: 'Is body contouring safe after losing weight on Ozempic or Wegovy?',
    answer:
      'Yes, with careful timing and selection. Patients who have lost significant weight on GLP-1 receptor agonists (Ozempic, Wegovy, Mounjaro) need to demonstrate weight stability for at least 3–6 months before surgery. This patient group presents specific tissue challenges: thinner dermis from rapid weight loss, potential lean mass loss, and occasionally nutritional deficiencies. A pre-surgical nutritional screen (albumin, haemoglobin, vitamin D, ferritin) is standard in our practice before proceeding to any skin-excision procedure.',
  },
  {
    question: 'What is the cost of liposuction in Bengaluru?',
    answer:
      'Liposuction costs vary based on the number of areas treated, the technique used (conventional vs VASER vs HD), anaesthesia and facility fees, and post-operative care requirements. VASER and HD liposuction carry a premium over standard liposuction due to equipment and technique differences. A precise cost is only meaningful after an in-person consultation to determine the appropriate scope of surgery for your anatomy. Consultations at Aesthetica Veda Clinic, Whitefield, Bengaluru, provide a personalised cost estimate.',
  },
  {
    question: 'How does VASER liposuction differ from traditional liposuction?',
    answer:
      'Traditional liposuction uses mechanical motion to break up and aspirate fat. VASER (Vibration Amplification of Sound Energy at Resonance) uses ultrasound energy delivered through small probes to emulsify fat cells selectively before aspiration. This is gentler on surrounding structures — nerves, blood vessels, connective tissue — which typically results in less bruising, more even contouring, and a smoother skin surface. VASER also enables high-definition contouring (HD Lipo) to etch muscular anatomy, which conventional liposuction cannot achieve with the same precision.',
  },
  {
    question: 'How long do liposuction results last?',
    answer:
      'Liposuction permanently removes fat cells from treated areas — those cells cannot regrow. However, remaining fat cells in the treated area and untreated adjacent areas can expand with weight gain. Maintaining a stable weight is essential for preserving the result long-term. Patients who keep their post-operative weight within 5–7 kg typically retain their liposuction results indefinitely. Significant weight gain redistributes to untreated areas, which may alter body proportions.',
  },
  {
    question: 'What is gynecomastia and what are the surgical options?',
    answer:
      'Gynecomastia is the enlargement of glandular breast tissue in men, graded I to IV. Grade I (minimal excess, good skin tone) is typically treated with VASER or conventional liposuction. Grades II–III with significant glandular tissue require surgical excision through a periareolar incision combined with liposuction. Grade IV cases with excess skin require skin reduction patterns similar to a breast reduction. The appropriate technique is determined at clinical assessment — photographs alone are insufficient for surgical planning.',
  },
  {
    question: 'Can multiple body contouring procedures be done in one surgery?',
    answer:
      'Combining procedures is common and reduces the total number of anaesthetic episodes and recovery periods. Safe combination surgery requires careful planning: operating time is generally limited to 6 hours or less, blood loss managed carefully, and procedures selected to avoid conflicting healing requirements. Common safe combinations include tummy tuck with liposuction, or mommy makeover procedures. The specific combination appropriate for you depends on your overall health, BMI, extent of planned surgery, and anaesthetic fitness.',
  },
  {
    question: 'What should I expect during rhinoplasty recovery?',
    answer:
      'Most rhinoplasty patients wear a nasal splint for 7–10 days. Bruising and swelling around the nose and eyes is expected in the first 2 weeks. Patients typically return to light work at 10–14 days. Most visible swelling resolves in 4–6 weeks, but subtle tip refinement continues over 12–18 months as scar tissue matures. Rhinoplasty results should not be judged until at least 12 months post-operatively. For South Asian patients with thicker skin envelopes, the timeline to see the final result may be longer.',
  },
  {
    question: 'What is the difference between plastic surgery standards in Dubai and India?',
    answer:
      'Both countries have rigorous medical licensing frameworks. Dubai\'s healthcare is regulated by the Dubai Health Authority (DHA); surgeons require a DHA licence specific to their specialty. India\'s National Medical Commission (NMC) governs medical practice; DNB (Diplomate of National Board) in Plastic Surgery is the equivalent of a postgraduate surgical qualification. The primary variable in outcomes is surgeon training and case volume, not geography. Dr. Sanjog Sharma maintains dual registration — KMC in India and DHA in Dubai — and performs 250+ procedures annually across both locations.',
  },
  {
    question: 'Is plastic surgery in India safe for NRI patients travelling from abroad?',
    answer:
      'Yes, for appropriately selected procedures and credentialled surgeons. Key planning considerations for travelling patients: arrange an in-person pre-operative assessment 1–2 days before surgery; plan a minimum stay of 10–14 days (longer for combined operations); note that most body contouring patients should avoid flying for 2 weeks minimum post-operatively; and arrange local follow-up care in your home country for ongoing wound care. Dr. Sharma regularly treats NRI patients from the UAE, UK, Australia, and Canada who coordinate surgery during visits home.',
  },
  {
    question: 'How long before surgery should I stop taking Ozempic or Mounjaro?',
    answer:
      'Most anaesthetists request a 1–2 week pause from GLP-1 medications (semaglutide, tirzepatide) before elective surgery. GLP-1 agonists slow gastric emptying, increasing aspiration risk under general anaesthesia even when standard fasting guidelines are followed. Your anaesthetist will provide specific guidance based on your dose and procedure type. Weight stability for 3–6 months before body contouring surgery remains the primary eligibility requirement regardless of medication status.',
  },
  {
    question: 'How do I know if I need a breast lift or breast augmentation?',
    answer:
      'This depends on what is driving your concern. If the primary issue is volume loss — deflation, reduced fullness — an implant (augmentation) addresses that directly. If the primary issue is position — drooping, nipple below the inframammary fold, skin excess — a mastopexy (lift) is required. Many post-pregnancy and post-weight-loss patients have both volume loss and ptosis, making a combined augmentation-mastopexy the appropriate procedure. A clinical examination is essential for this determination — photographs alone are insufficient.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Blog', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Plastic Surgery FAQ', item: PAGE_URL },
  ],
}

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Breadcrumb items={[{ label: 'Blog', href: '/' }, { label: 'FAQ' }]} />

        <header className="mb-10">
          <h1 className="text-3xl font-bold text-brand-charcoal mb-3">
            Plastic Surgery — Frequently Asked Questions
          </h1>
          <p className="text-brand-charcoal/70 leading-relaxed">
            Answers by Dr. Sanjog Sharma, {AUTHOR.credentialsFull} — practising at Cocoona Centre for
            Aesthetic Transformation, Emirates Hospital, and Dubai London Hospital in Dubai, and at
            Aesthetica Veda Clinic, Whitefield, Bengaluru.
          </p>
        </header>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group bg-white border border-brand-charcoal/10 rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 p-5 font-medium text-brand-charcoal cursor-pointer list-none select-none hover:bg-brand-cream/50 transition-colors">
                <span>{faq.question}</span>
                <span className="text-brand-charcoal/30 group-open:rotate-180 transition-transform shrink-0 text-lg">
                  ▾
                </span>
              </summary>
              <div className="px-5 pb-5">
                <p className="text-sm text-brand-charcoal/80 leading-relaxed">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 p-6 bg-brand-cream rounded-xl border border-brand-charcoal/10">
          <p className="text-xs uppercase tracking-widest text-brand-charcoal/40 mb-2">Medical Disclaimer</p>
          <p className="text-sm text-brand-charcoal/70 leading-relaxed">
            These answers are for general educational purposes only and do not constitute medical advice.
            They do not replace an in-person consultation with a qualified surgeon. Information is correct
            at the date of publication and reviewed by Dr. Sanjog Sharma, {AUTHOR.credentials}.
          </p>
          <a
            href={AUTHOR.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-rust hover:text-brand-charcoal underline transition-colors"
          >
            Book a consultation at drsanjog.com →
          </a>
        </div>
      </div>
    </>
  )
}
