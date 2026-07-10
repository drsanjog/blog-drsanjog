import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  formatDate,
} from '@/lib/posts'
import { AUTHOR, SITE_URL } from '@/lib/constants'
import JsonLd from '@/components/JsonLd'
import Breadcrumb from '@/components/Breadcrumb'
import AuthorBio from '@/components/AuthorBio'
import MedicalDisclaimer from '@/components/MedicalDisclaimer'
import RelatedPosts from '@/components/RelatedPosts'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

// Keep meta descriptions inside the 150–160 char SERP window. Trims on a word
// boundary as a safety net; posts should still author a good ~155-char description.
function clampDescription(desc: string, max = 160): string {
  if (desc.length <= max) return desc
  const cut = desc.slice(0, max - 1)
  return cut.slice(0, cut.lastIndexOf(' ')).trimEnd() + '…'
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}

  const { title, seoTitle, description, date, dateModified, targetKeyword, keywords } =
    post.frontmatter
  const url = `${SITE_URL}/blog/${params.slug}`
  // <title> uses the short seoTitle when present (layout appends " | Dr. Sanjog
  // Sharma"); the full title stays as the on-page H1.
  const metaTitle = seoTitle ?? title
  const metaDescription = clampDescription(description)

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywords ?? [targetKeyword],
    authors: [{ name: `${AUTHOR.name}, ${AUTHOR.credentials}` }],
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: {
        'en-IN': url,
        'en-AE': url,
      },
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url,
      type: 'article',
      publishedTime: date,
      modifiedTime: dateModified ?? date,
      authors: [`${AUTHOR.name}, ${AUTHOR.credentials}`],
      images: [{ url: `${url}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const { frontmatter, content, readingTime } = post
  const url = `${SITE_URL}/blog/${params.slug}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    dateModified: frontmatter.dateModified ?? frontmatter.date,
    url,
    author: {
      '@type': 'Physician',
      name: AUTHOR.name,
      honorificSuffix: AUTHOR.credentials,
      medicalSpecialty: AUTHOR.specialty,
      affiliation: [
        ...AUTHOR.dubaiClinics.map((c) => ({
          '@type': 'MedicalOrganization',
          name: c.name,
          address: { '@type': 'PostalAddress', addressLocality: c.location, addressCountry: 'AE' },
        })),
        {
          '@type': 'MedicalOrganization',
          name: AUTHOR.clinic,
          address: { '@type': 'PostalAddress', addressLocality: AUTHOR.city, addressCountry: 'IN' },
        },
      ],
      identifier: [
        { '@type': 'PropertyValue', name: 'Karnataka Medical Council', value: AUTHOR.kmc },
        { '@type': 'PropertyValue', name: 'DHA License', value: AUTHOR.dha },
      ],
      url: AUTHOR.siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: AUTHOR.clinic,
      url: AUTHOR.siteUrl,
    },
    mainContentOfPage: { '@type': 'WebPageElement' },
  }

  const faqSchema =
    frontmatter.faqs && frontmatter.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: frontmatter.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }
      : null

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR.name,
    jobTitle: 'Plastic and Reconstructive Surgeon',
    description: `${AUTHOR.credentials}. Plastic and cosmetic surgeon practising in Dubai and Bengaluru.`,
    url: AUTHOR.siteUrl,
    sameAs: [AUTHOR.siteUrl, AUTHOR.instagram, AUTHOR.linkedin],
    knowsAbout: ['plastic surgery', 'cosmetic surgery', 'body contouring', 'reconstructive surgery', 'fat transfer', 'rhinoplasty', 'liposuction'],
    alumniOf: AUTHOR.training.map((t) => ({ '@type': 'CollegeOrUniversity', name: t })),
    memberOf: { '@type': 'Organization', name: 'Association of Plastic Surgeons of India (APSI)' },
    hasCredential: ['MBBS', 'MS', 'DNB'].map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: c,
    })),
    worksFor: [
      ...AUTHOR.dubaiClinics.map((c) => ({
        '@type': 'MedicalOrganization',
        name: c.name,
        address: { '@type': 'PostalAddress', addressLocality: c.location, addressCountry: 'AE' },
      })),
      {
        '@type': 'MedicalOrganization',
        name: AUTHOR.clinic,
        address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressCountry: 'IN' },
      },
    ],
  }

  const procedureSchema = frontmatter.procedureName
    ? {
        '@context': 'https://schema.org',
        '@type': 'MedicalProcedure',
        name: frontmatter.procedureName,
        ...(frontmatter.procedureAlt && { alternateName: frontmatter.procedureAlt }),
        procedureType: 'Surgical',
        ...(frontmatter.procedureBodyLocation && { bodyLocation: frontmatter.procedureBodyLocation }),
        ...(frontmatter.procedurePrep && { preparation: frontmatter.procedurePrep }),
        ...(frontmatter.procedureHow && { howPerformed: frontmatter.procedureHow }),
        ...(frontmatter.procedureFollowup && { followup: frontmatter.procedureFollowup }),
        recognizingAuthority: {
          '@type': 'Organization',
          name: 'International Society of Aesthetic Plastic Surgery (ISAPS)',
          url: 'https://www.isaps.org',
        },
      }
    : null

  const howToSchema =
    frontmatter.howToSteps && frontmatter.howToSteps.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: frontmatter.howToName ?? `How ${frontmatter.procedureName ?? 'This Procedure'} is Performed`,
          step: frontmatter.howToSteps.map((s) => ({
            '@type': 'HowToStep',
            name: s.name,
            text: s.text,
          })),
        }
      : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 2, name: frontmatter.title, item: url },
    ],
  }

  const related = getRelatedPosts(params.slug, frontmatter.tags ?? [])

  return (
    <>
      <JsonLd data={articleSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <JsonLd data={personSchema} />
      {procedureSchema && <JsonLd data={procedureSchema} />}
      {howToSchema && <JsonLd data={howToSchema} />}
      <JsonLd data={breadcrumbSchema} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Breadcrumb items={[{ label: 'Blog', href: '/' }, { label: frontmatter.title }]} />

        {frontmatter.coverImage && (
          <div className="mb-10 rounded-xl overflow-hidden">
            <Image
              src={frontmatter.coverImage}
              alt={frontmatter.coverImageAlt ?? frontmatter.title}
              width={1200}
              height={630}
              className="w-full object-cover max-h-[420px]"
              priority
            />
            {frontmatter.coverImageCredit && (
              <p className="text-xs text-brand-charcoal/40 mt-1.5 text-right pr-1">
                Photo: {frontmatter.coverImageCredit}
              </p>
            )}
          </div>
        )}

        <header className="mb-10">
          <div className="flex items-center gap-2 text-sm text-brand-charcoal/50 mb-4">
            <time dateTime={frontmatter.date}>
              {formatDate(frontmatter.date)}
            </time>
            <span aria-hidden>·</span>
            <span>{readingTime}</span>
            {frontmatter.dateModified &&
              frontmatter.dateModified !== frontmatter.date && (
                <>
                  <span aria-hidden>·</span>
                  <span>Updated {formatDate(frontmatter.dateModified)}</span>
                </>
              )}
          </div>
          <h1 className="text-3xl font-bold text-brand-charcoal leading-tight">
            {frontmatter.title}
          </h1>
          <p className="mt-3 text-lg text-brand-charcoal/70 leading-relaxed">
            {frontmatter.description}
          </p>
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-brand-olive/10 text-brand-olive px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <article className="prose max-w-none prose-headings:font-semibold prose-headings:text-brand-charcoal prose-p:text-brand-charcoal/80 prose-a:text-brand-rust prose-a:no-underline hover:prose-a:underline prose-code:text-brand-rust prose-code:bg-brand-rust/10 prose-code:px-1 prose-code:rounded prose-code:font-normal prose-strong:text-brand-charcoal prose-li:text-brand-charcoal/80 prose-th:text-brand-charcoal prose-th:bg-brand-cream prose-th:font-semibold prose-td:text-brand-charcoal/80 prose-table:w-full prose-thead:border-b-2 prose-thead:border-brand-charcoal/20 [&_table]:block [&_table]:overflow-x-auto [&_table]:border [&_table]:border-brand-charcoal/10 [&_table]:rounded-lg [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2 [&_tr]:border-b [&_tr]:border-brand-charcoal/10">
          <MDXRemote source={content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </article>

        {frontmatter.faqs && frontmatter.faqs.length > 0 && (
          <section className="mt-12" aria-label="Frequently Asked Questions">
            <h2 className="text-xl font-semibold text-brand-charcoal mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {frontmatter.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group bg-white border border-brand-charcoal/10 rounded-lg"
                >
                  <summary className="flex items-center justify-between gap-4 p-4 font-medium text-brand-charcoal cursor-pointer list-none select-none">
                    {faq.question}
                    <span className="text-brand-charcoal/40 group-open:rotate-180 transition-transform shrink-0">
                      ▾
                    </span>
                  </summary>
                  <p className="px-4 pb-4 text-sm text-brand-charcoal/80 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        <MedicalDisclaimer reviewedDate={frontmatter.dateModified ?? frontmatter.date} />
        <AuthorBio />
        <RelatedPosts posts={related} />
      </div>
    </>
  )
}
