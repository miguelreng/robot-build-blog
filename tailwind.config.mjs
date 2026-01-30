/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,reveal,svelte,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        yellix: ['Yellix', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#fff',
            a: {
              color: '#fff',
              '&:hover': {
                color: '#a1a1aa',
              },
            },
            h1: { color: '#fff' },
            h2: { color: '#fff' },
            h3: { color: '#fff' },
            h4: { color: '#fff' },
            strong: { color: '#fff' },
            code: { color: '#fff' },
            blockquote: {
              color: '#d4d4d8',
              borderLeftColor: '#3f3f46',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
