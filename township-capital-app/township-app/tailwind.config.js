/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#111238',
        cream: '#F7F2E7',
        creamdeep: '#EFE7D6',
        gold: '#D4AF37',
        goldsoft: '#e8cd7a',
        stone: '#a05a2c',
        sage: '#5b7a5e',
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
