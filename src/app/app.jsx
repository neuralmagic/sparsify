import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";

import makeTheme, { useDarkMode } from "./app-theme";
import AppSideNav from "./sidenav";
import makeStyles from "./app-styles";
import AppMain from "./main";
import useLocationUpdateStore from "./hooks/use-location-update-store";

function App() {
  const darkMode = useDarkMode();
  const theme = makeTheme(darkMode);
  const sideNavTheme = makeTheme(!darkMode);
  const useStyles = makeStyles();
  const classes = useStyles();
  useLocationUpdateStore();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <ThemeProvider theme={sideNavTheme}>
          <AppSideNav />
        </ThemeProvider>

        <div className={classes.main}>
          <AppMain />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
