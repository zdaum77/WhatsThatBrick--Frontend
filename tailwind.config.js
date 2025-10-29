/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        lego: {
          50: '#FFF9E6',        // Light yellow background (was 'yellow')
          100: '#FFF5CC',       // Slightly darker yellow (was 'cream')
          500: '#E3000F',       // LEGO red (was 'red')
          600: '#C5000D',       // Darker red for hover (was 'darkred')
          800: '#8B0000',       // Dark red for text (was 'textred')
        },
      },
    },
  },
  plugins: [],
}