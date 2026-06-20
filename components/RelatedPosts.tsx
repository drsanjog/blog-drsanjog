import Link from 'next/link'
import { PostMeta, formatDate } from '@/lib/posts'

export default function RelatedPosts({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null

  return (
    <section className="mt-12" aria-label="Related articles">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">
        Related Articles
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow group"
          >
            <p className="text-xs text-slate-500 mb-1.5">
              {formatDate(post.frontmatter.date)}
            </p>
            <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 leading-snug line-clamp-3 transition-colors">
              {post.frontmatter.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
