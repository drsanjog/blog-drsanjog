import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Driven by CSS variables (see app/globals.css + per-site override in
        // app/layout.tsx) so every `brand-*` class re-themes per site.
        brand: {
          cream: 'var(--brand-cream)',
          charcoal: 'var(--brand-charcoal)',
          olive: 'var(--brand-olive)',
          rust: 'var(--brand-rust)',
        },
      },
    },
  },
  plugins: [typography],
}

export default config
