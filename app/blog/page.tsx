import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import BlogCard from '@/components/BlogCard'

export const metadata: Metadata = {
  title: 'Medical Blog — Plastic & Reconstructive Surgery',
  description:
    'Evidence-based educational articles on plastic and reconstructive surgery by Dr. Sanjog Sharma, MS DNB, Aesthetica Veda Clinic, Bengaluru.',
  alternates: { canonical: 'https://blog.drsanjog.com/blog' },
}

export default function BlogListPage() {
  const posts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Medical Blog</h1>
        <p className="mt-2 text-slate-600 text-lg">
          Evidence-based articles on plastic and reconstructive surgery.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-slate-500">No articles published yet. Check back soon.</p>
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
