/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        "bg-color": "#F9F9F9",
        "primary": "#0C2348",
        "active": "#159DFF",
        "selected": "#438ABE",
        "accepted": "#4CAF50",
        "rejected": "#FF3B30",
      },
      screens: {
        'xs': '375px'
      },
      gridTemplateColumns: {
        '2A': '3fr 1fr',
        '2B': '1fr 3fr',
        '3A': '1fr 3fr 1fr',
        '4A': '1fr 1fr 1fr 4fr',
        '5A': '1fr 1fr 1fr 6fr',
        'assignation': '3fr 4fr'
      },
      gridTemplateRows: {
        '5A': '1fr 1fr 1fr 1fr 6fr'
      },
      fontSize:{
        'lg':'24px',
      }
    }
  },
  plugins: [
    require("flowbite/plugin")
  ],
}
