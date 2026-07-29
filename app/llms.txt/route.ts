import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'
import { site } from '@/lib/site'

export const dynamic = 'force-static'

export function GET() {
  const posts = getAllPosts()

  const body = site.llmsBody(posts)

  return new NextResponse(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
