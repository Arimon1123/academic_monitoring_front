/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors:{
        "bg-color": "#F9F9F9",
        "primary":"#0C2348",
        "active": "#159DFF" 
      }
    },
  },
  plugins: [],
}