/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'barber': {
          'red': '#C41E3A',
          'blue': '#003366',
          'cream': '#F5F1E8',
          'gold': '#D4AF37',
          'dark': '#1A1A1A',
        }
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
