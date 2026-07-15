/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      colors: {
        ink: '#08090b',
        smoke: '#f3f0ea',
        brass: '#c7a66a',
        jade: '#6eb6a1',
        wine: '#7e394f',
      },
      boxShadow: {
        glass: '0 24px 80px rgba(0, 0, 0, 0.34)',
        control: '0 12px 36px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
