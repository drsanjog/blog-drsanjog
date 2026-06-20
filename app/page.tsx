import { getAllPosts } from '@/lib/posts'
import BlogCard from '@/components/BlogCard'

export { metadata } from './blog/page'

export default function Home() {
  const posts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-brand-charcoal">Medical Blog</h1>
        <p className="mt-2 text-brand-charcoal/70 text-lg">
          Evidence-based articles on plastic and reconstructive surgery.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-brand-charcoal/50">No articles published yet. Check back soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
