import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  formatDate,
} from '@/lib/posts'
import { AUTHOR, SITE_URL } from '@/lib/constants'
import JsonLd from '@/components/JsonLd'
import AuthorBio from '@/components/AuthorBio'
import MedicalDisclaimer from '@/components/MedicalDisclaimer'
import RelatedPosts from '@/components/RelatedPosts'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}

  const { title, description, date, targetKeyword } = post.frontmatter
  const url = `${SITE_URL}/blog/${params.slug}`

  return {
    title,
    description,
    keywords: targetKeyword,
    authors: [{ name: `${AUTHOR.name}, ${AUTHOR.credentials}` }],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: date,
      authors: [`${AUTHOR.name}, ${AUTHOR.credentials}`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
    dateModified: frontmatter.date,
    url,
    author: {
      '@type': 'Physician',
      name: AUTHOR.name,
      honorificSuffix: AUTHOR.credentials,
      medicalSpecialty: AUTHOR.specialty,
      worksFor: {
        '@type': 'MedicalOrganization',
        name: AUTHOR.clinic,
        address: {
          '@type': 'PostalAddress',
          addressLocality: AUTHOR.city,
          addressCountry: 'IN',
        },
      },
      identifier: [
        {
          '@type': 'PropertyValue',
          name: 'Karnataka Medical Council',
          value: AUTHOR.kmc,
        },
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

  const related = getRelatedPosts(params.slug, frontmatter.tags ?? [])

  return (
    <>
      <JsonLd data={articleSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

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

        <article className="prose max-w-none prose-headings:font-semibold prose-headings:text-brand-charcoal prose-p:text-brand-charcoal/80 prose-a:text-brand-rust prose-a:no-underline hover:prose-a:underline prose-code:text-brand-rust prose-code:bg-brand-rust/10 prose-code:px-1 prose-code:rounded prose-code:font-normal prose-strong:text-brand-charcoal prose-li:text-brand-charcoal/80 prose-th:text-brand-charcoal prose-td:text-brand-charcoal/80">
          <MDXRemote source={content} />
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

        <MedicalDisclaimer />
        <AuthorBio />
        <RelatedPosts posts={related} />
      </div>
    </>
  )
}
