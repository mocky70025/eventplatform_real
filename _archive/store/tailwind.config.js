/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF8A5C',
          50: '#fff5f0',
          100: '#ffe8e0',
          200: '#ffd5c8',
          300: '#ffb8a5',
          400: '#ff9a7c',
          500: '#FF8A5C',
          600: '#e67a52',
          700: '#cc6a48',
        },
        secondary: {
          DEFAULT: '#5DABA8',
          50: '#f0f8f7',
          100: '#d4eeeb',
          200: '#a9ddda',
          300: '#7eccc9',
          400: '#6bbbb8',
          500: '#5DABA8',
          600: '#539a97',
          700: '#498986',
        },
        background: '#fff5f0',
      },
      boxShadow: {
        'custom': '0px 8px 32px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
