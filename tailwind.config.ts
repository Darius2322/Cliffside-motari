import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1B211C',
        canopy: { DEFAULT: '#23483A', dark: '#16302A' },
        loam: { DEFAULT: '#B6772E', dark: '#9C6425' },
        paper: '#F2F0E6',
        surface: '#FFFFFF',
        mist: '#6B7268',
        border: '#DAD6C8',
      },
      fontFamily: {
        serif: ['var(--font-spectral)', 'Georgia', 'serif'],
        sans: ['var(--font-public-sans)', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
