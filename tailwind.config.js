module.exports = {
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  theme: {
    screens: {
      'sm': '576px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  }
//   daisyui: {
//     themes: [
//       {
//         // TODO
//         mydark: {
//           primary: "#33b7a3",

//           secondary: "#1cc4a3",

//           accent: "#d31815",

//           neutral: "#263036",

//           "base-100": "#404044",

//           info: "#13b6bf",

//           success: "#19a37a",

//           warning: "#d7ac14",

//           error: "#f7405c",
//         },
//       },
//     ],
//   },
};
