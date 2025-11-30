/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FDF5FF",
          100: "#F8E9FF",
          200: "#F0D4FF",
          300: "#E0B1FF",
          400: "#C47DFF",
          500: "#A54BFF",
          600: "#8B2EE6",
          700: "#6B20B4",
          800: "#4E1784",
          900: "#341056"
        }
      },
      borderRadius: {
        "2xl": "1.5rem"
      }
    },
  },
  plugins: [],
};
