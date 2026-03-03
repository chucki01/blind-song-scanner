/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        russo: ["'Russo One'", "sans-serif"],
        raleway: ["'Raleway'", "sans-serif"],
      },
      colors: {
        acid: "#CAFF00",
      },
      backgroundImage: {
        "gradient-radial-t":
          "radial-gradient(ellipse at top, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
