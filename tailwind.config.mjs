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
            color: '#000',
            a: {
              color: '#000',
              textDecoration: 'none',
              borderBottom: '1px solid #e5e7eb',
              '&:hover': {
                borderBottomColor: '#000',
              },
            },
            h1: { color: '#000', fontWeight: '500', tracking: '-0.02em' },
            h2: { color: '#000', fontWeight: '500' },
            h3: { color: '#000', fontWeight: '500' },
            strong: { color: '#000' },
            blockquote: {
              color: '#71717a',
              borderLeftColor: '#e5e7eb',
              fontStyle: 'italic',
            },
            code: { color: '#000', background: '#f4f4f5', padding: '2px 4px', borderRadius: '4px' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
