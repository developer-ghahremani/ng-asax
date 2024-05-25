/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./projects/**/*.{html,ts,css,scss}"],
  theme: {
    extend: {
      colors: {
        dark: {
          1: "#323E54",
          2: "#E0E3EB",
          3: "#323E54",
        },
        gray: {
          1: "#E0E3EB",
          2: "#787B86",
        },
        blue: {
          1: "#2962FF",
          2: "#EAF0FF",
        },
        red: {
          1: "#F7525F",
          2: "#FFEEEF",
          3: "#FDDCDF",
        },
        danger: {
          1: "#F7525F",
        },
        green: {
          1: "#00A97F",
          2: "#00A97F10",
        },
        orange: {
          1: "#FF9800",
          2: "#FFF5E6",
        },
      },
    },
  },
  plugins: [],
};
