/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
        }
      },
      fontFamily: {
        sans: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'apple': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'apple-dark': '0 4px 24px -2px rgba(0, 0, 0, 0.35)',
      }
    },
  },
  plugins: [],
}
