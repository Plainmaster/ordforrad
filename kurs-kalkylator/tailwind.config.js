/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          700: '#2F6664',
          100: '#E8F0EF',
          200: '#A5C4C2',
        },
        tan: '#D4A373',
        purple: '#6D6875',
        bg: '#F9F8F6',
        ink: '#2D3339',
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
