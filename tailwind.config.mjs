/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,reveal,svelte,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        yellix: ['Yellix', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#403F3C',
            fontSize: '17px',
            lineHeight: '1.6',
            fontFamily: 'Yellix, sans-serif',
            a: {
              color: '#403F3C',
              textDecoration: 'none',
              fontWeight: '600',
              borderBottom: '1px solid rgba(64, 63, 60, 0.1)',
              '&:hover': {
                borderBottomColor: '#403F3C',
              },
            },
            h1: { color: '#403F3C', fontWeight: '500', letterSpacing: '-0.025em' },
            h2: { color: '#403F3C', fontWeight: '500', letterSpacing: '-0.02em', marginTop: '2.5em' },
            h3: { color: '#403F3C', fontWeight: '500' },
            strong: { color: '#403F3C', fontWeight: '600' },
            blockquote: {
              color: '#403F3C',
              opacity: '0.6',
              borderLeftWidth: '1px',
              borderLeftColor: 'rgba(64, 63, 60, 0.1)',
              fontStyle: 'normal',
            },
            code: { 
              color: '#403F3C', 
              background: 'rgba(64, 63, 60, 0.05)', 
              padding: '3px 6px', 
              borderRadius: '6px', 
              fontWeight: '500',
              fontSize: '0.9em'
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
