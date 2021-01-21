import { createMuiTheme } from "@material-ui/core/styles";
import { useState } from "react";

export function useDarkMode() {
  return useState(false);
}

export default function makeTheme(darkMode) {
  const theme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
      primary: { main: "#4652B1", contrastText: "#FFFFFF" },
      secondary: { main: "#ff9900", contrastText: "#FFFFFF" },
      disabled: { main: "#777777" },
    },
    typography: {
      fontFamily: ["Roboto", "Open Sans", "sans-serif"].join(","),
    },
  });

  if (darkMode) {
    // make the background color darker
    theme.palette.background.default = "#1D1D1D";
    theme.palette.background.paper = "#303030";

    theme.palette.overlay = "rgba(255, 255, 255, 0.3)";
  } else {
    theme.palette.overlay = "rgba(0, 0, 0, 0.7)";
  }

  return theme;
}

export const referenceDarkTheme = makeTheme(true);
export const referenceLightTheme = makeTheme(false);
