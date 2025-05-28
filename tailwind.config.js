/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#f9f9f9',
        'primary-text': '#1e1e1e',
        'secondary-text': '#777777',
        'accent': '#de3cab',
        'accent-dark': '#db27a3',
      },
    },
  },
  plugins: [],
}