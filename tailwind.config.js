module.exports = {
  darkMode: "class",
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  theme: {
    screens: {
      sm: "576px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        "color-base-l100": withOpacityValue("--color-base-l100"),
      },
    },
  },
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=night]"],
          // "base-200": "#252d37",
          // "base-300": "#343841",
          "base-200": "#1a1d22",
          "base-300": "#10131a",
          "secondary": "#9333ea",
          "accent": "#0d9488",
        },
      },
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=emerald]"],
          "base-200": "#e0e1e1",
          "base-300": "#cccccc",
        },
      },
    ],
  },
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

// this function handles the opacity of color
function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `hsl(var(${variable}))`;
    }
    return `hsl(var(${variable}) / ${opacityValue})`;
  };
}
