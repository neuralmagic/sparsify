import { createMuiTheme } from "@material-ui/core/styles";

export function useDarkMode() {
  return false;
}

export default function makeTheme(darkMode) {
  const theme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
      primary: { main: "#4652B1", contrastText: "#FFFFFF" },
      secondary: { main: "#ff9900", contrastText: "#FFFFFF" },
    },
    typography: {
      fontFamily: ["Roboto", "Open Sans", "sans-serif"].join(","),
    },
  });

  if (darkMode) {
    // make the background color darker
    theme.palette.background.default = "#1D1D1D";
    theme.palette.background.paper = "#303030";
  }

  return theme;
}
