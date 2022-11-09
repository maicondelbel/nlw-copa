/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
    extend: {
      backgroundImage: {
        'app-bg': "url('/app-background.png')",
      },
      fontFamily: {
        sans: 'Roboto, sans-serif',
      },
      colors: {
        nlw: {
          'yellow-500': '#F7DD43',
          'green-300': '#129E57',
          'green-500': '#047C3F',
        },
        gray: {
          100: '#E1E1E6',
          200: '#C4C4CC',
          300: '#8D8D99',
          600: '#323238',
          800: '#202024',
          900: '#121214',
        },
      },
    },
  },
  plugins: [],
}
