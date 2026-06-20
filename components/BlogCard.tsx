import Link from 'next/link'
import Image from 'next/image'
import { PostMeta, formatDate } from '@/lib/posts'

export default function BlogCard({ post }: { post: PostMeta }) {
  return (
    <article className="bg-white rounded-xl border border-brand-charcoal/10 hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      {post.frontmatter.coverImage && (
        <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden>
          <Image
            src={post.frontmatter.coverImage}
            alt={post.frontmatter.coverImageAlt ?? post.frontmatter.title}
            width={600}
            height={315}
            className="w-full object-cover h-44"
          />
        </Link>
      )}
      <div className="p-6 flex flex-col flex-1">
      <div className="flex items-center gap-2 text-xs text-brand-charcoal/50 mb-3">
        <time dateTime={post.frontmatter.date}>
          {formatDate(post.frontmatter.date)}
        </time>
        <span aria-hidden>·</span>
        <span>{post.readingTime}</span>
      </div>
      <h2 className="text-base font-semibold text-brand-charcoal mb-2 leading-snug">
        <Link
          href={`/blog/${post.slug}`}
          className="hover:text-brand-rust transition-colors"
        >
          {post.frontmatter.title}
        </Link>
      </h2>
      <p className="text-brand-charcoal/70 text-sm line-clamp-3 flex-1">
        {post.frontmatter.description}
      </p>
      {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {post.frontmatter.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-brand-olive/10 text-brand-olive px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <Link
        href={`/blog/${post.slug}`}
        className="mt-4 text-sm font-medium text-brand-rust hover:text-brand-charcoal transition-colors"
        aria-label={`Read: ${post.frontmatter.title}`}
      >
        Read article →
      </Link>
      </div>
    </article>
  )
}
