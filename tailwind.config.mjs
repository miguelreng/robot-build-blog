/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,reveal,svelte,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#262626',
          yellow: '#F0ED4E',
          gray: {
            90: '#403F3C',
            80: '#5C5B58',
            50: '#A2A19E',
            30: '#CAC9C6',
            20: '#E8E7E5',
            10: '#F8F6F3',
          },
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        yellix: ['Yellix', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#403F3C', // Using R-Gray 90 for body text
            fontSize: 'max(15px, 0.95em)',
            lineHeight: '1.6',
            fontFamily: 'Yellix, sans-serif',
            fontWeight: '500',
            a: {
              color: '#403F3C',
              textDecoration: 'none',
              fontWeight: '500',
              borderBottom: '1px solid rgba(64, 63, 60, 0.1)',
              '&:hover': {
                borderBottomColor: '#403F3C',
              },
            },
            h1: { display: 'none' },
            h2: { color: '#403F3C', fontWeight: '500', marginTop: '2.5em', fontSize: '1.25em' },
            h3: { color: '#403F3C', fontWeight: '500', fontSize: '1.1em' },
            strong: { color: 'inherit' },
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
