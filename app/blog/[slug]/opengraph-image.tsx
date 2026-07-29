import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@/lib/posts'
import { site } from '@/lib/site'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  const title = post?.frontmatter.title ?? 'Medical Blog'

  return new ImageResponse(
    (
      <div
        style={{
          background: `linear-gradient(135deg, ${site.ui.ogGradientFrom} 0%, ${site.ui.ogGradientTo} 100%)`,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px',
          fontFamily: 'sans-serif',
          color: 'white',
        }}
      >
        <div
          style={{
            fontSize: 16,
            opacity: 0.6,
            marginBottom: 32,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          {site.ui.ogHost}
        </div>
        <div
          style={{
            fontSize: title.length > 60 ? 42 : 52,
            fontWeight: 700,
            lineHeight: 1.2,
            flex: 1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 20,
            opacity: 0.8,
            paddingTop: 28,
            borderTop: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          {site.ui.ogSubtitle}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
