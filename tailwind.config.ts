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
        navy: {
          700: '#1e3a5f',
          800: '#162d4a',
          900: '#0f1f33',
        },
      },
    },
  },
  plugins: [typography],
}

export default config
