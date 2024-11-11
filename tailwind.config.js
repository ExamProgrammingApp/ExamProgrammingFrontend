/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-1": "#14213D",
        "orange-1": "#E1A23B",
        "gray-1": "#E5E5E5",
      },
      height: {
        500: "125rem",
      },
      width: {
        700: "150rem",
      },
    },
  },
  plugins: [],
};
