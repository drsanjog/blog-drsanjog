import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
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
        <header className="mb-10">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <time dateTime={frontmatter.date}>
              {formatDate(frontmatter.date)}
            </time>
            <span aria-hidden>·</span>
            <span>{readingTime}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">
            {frontmatter.title}
          </h1>
          <p className="mt-3 text-lg text-slate-600 leading-relaxed">
            {frontmatter.description}
          </p>
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <article className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-blue-700 prose-a:no-underline hover:prose-a:underline prose-code:text-blue-800 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded prose-code:font-normal prose-strong:text-slate-900">
          <MDXRemote source={content} />
        </article>

        {frontmatter.faqs && frontmatter.faqs.length > 0 && (
          <section className="mt-12" aria-label="Frequently Asked Questions">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {frontmatter.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group bg-white border border-slate-200 rounded-lg"
                >
                  <summary className="flex items-center justify-between gap-4 p-4 font-medium text-slate-900 cursor-pointer list-none select-none">
                    {faq.question}
                    <span className="text-slate-400 group-open:rotate-180 transition-transform shrink-0">
                      ▾
                    </span>
                  </summary>
                  <p className="px-4 pb-4 text-sm text-slate-700 leading-relaxed">
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
