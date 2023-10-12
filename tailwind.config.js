/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "slide-out-left": "slide-out-left 1.5s both",
      },
      keyframes: {
        "slide-out-left": {
          "0%": {
            transform: "translateX(0)",
            opacity: "1",
          },
          "100%": {
            transform: "translateX(-1000px)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [],
};
