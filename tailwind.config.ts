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
        brand: {
          cream: '#F5F0E8',
          charcoal: '#1C1C1C',
          olive: '#4A5240',
          rust: '#C4622D',
        },
      },
    },
  },
  plugins: [typography],
}

export default config
