/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-color": "#F9F9F9",
        "primary": "#0C2348",
        "active": "#159DFF"
      },
      screens: {
        '2xl': { 'max': '1535px' },
        // => @media (max-width: 1535px) { ... }

        'xl': { 'max': '1279px' },
        // => @media (max-width: 1279px) { ... }

        'lg': { 'max': '1023px' },
        // => @media (max-width: 1023px) { ... }

        'md': { 'max': '767px' },
        // => @media (max-width: 767px) { ... }

        'sm': { 'max': '639px' },
        // => @media (max-width: 639px) { ... }
      },
      gridTemplateColumns: {
        '2A': '3fr 1fr',
        'navbar': '3rem 1fr',
        'sidebar': '10vw 90vw',
        'main': '1fr',
      },
    }
  },
  plugins: [],
}