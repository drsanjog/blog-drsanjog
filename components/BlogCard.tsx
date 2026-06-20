import Link from 'next/link'
import { PostMeta, formatDate } from '@/lib/posts'

export default function BlogCard({ post }: { post: PostMeta }) {
  return (
    <article className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
        <time dateTime={post.frontmatter.date}>
          {formatDate(post.frontmatter.date)}
        </time>
        <span aria-hidden>·</span>
        <span>{post.readingTime}</span>
      </div>
      <h2 className="text-base font-semibold text-slate-900 mb-2 leading-snug">
        <Link
          href={`/blog/${post.slug}`}
          className="hover:text-blue-700 transition-colors"
        >
          {post.frontmatter.title}
        </Link>
      </h2>
      <p className="text-slate-600 text-sm line-clamp-3 flex-1">
        {post.frontmatter.description}
      </p>
      {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {post.frontmatter.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <Link
        href={`/blog/${post.slug}`}
        className="mt-4 text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors"
        aria-label={`Read: ${post.frontmatter.title}`}
      >
        Read article →
      </Link>
    </article>
  )
}
