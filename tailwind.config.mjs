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
            fontSize: '15px',
            lineHeight: '1.6',
            fontFamily: 'Yellix, sans-serif',
            fontWeight: '400',
            a: {
              color: '#403F3C',
              textDecoration: 'none',
              fontWeight: '600',
              borderBottom: '1px solid rgba(64, 63, 60, 0.1)',
              '&:hover': {
                borderBottomColor: '#403F3C',
              },
            },
            h1: { display: 'none' }, // Ocultamos el H1 dentro del MD para evitar duplicados
            h2: { color: '#403F3C', fontWeight: '500', letterSpacing: '-0.02em', marginTop: '2.5em', fontSize: '1.25em' },
            h3: { color: '#403F3C', fontWeight: '500', fontSize: '1.1em' },
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
              fontSize: '13px'
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
