/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,reveal,svelte,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        yellix: ['Yellix', 'sans-serif'],
        graphik: ['Graphik', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#71717a', // Zinc 500 para el cuerpo
            fontSize: '16px',
            lineHeight: '1.7',
            fontFamily: 'Graphik, sans-serif',
            a: {
              color: '#000',
              textDecoration: 'none',
              fontWeight: '500',
              borderBottom: '1px solid #e5e7eb',
              '&:hover': {
                borderBottomColor: '#000',
              },
            },
            h1: { color: '#000', fontFamily: 'Yellix, sans-serif', fontWeight: '500', letterSpacing: '-0.02em' },
            h2: { color: '#000', fontFamily: 'Yellix, sans-serif', fontWeight: '500', letterSpacing: '-0.01em', marginTop: '2em' },
            h3: { color: '#000', fontFamily: 'Yellix, sans-serif', fontWeight: '500' },
            strong: { color: '#000', fontWeight: '500' },
            blockquote: {
              color: '#a1a1aa',
              borderLeftWidth: '1px',
              borderLeftColor: '#e5e7eb',
              fontStyle: 'normal',
              fontWeight: '400',
            },
            code: { color: '#000', background: '#f4f4f5', padding: '2px 4px', borderRadius: '4px', fontWeight: '400' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
