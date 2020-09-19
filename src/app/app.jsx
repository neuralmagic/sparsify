import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";

import makeTheme, { useDarkMode } from "./app-theme";
import AppSideNav from "./sidenav";
import makeStyles from "./app-styles";
import AppMain from "./main";

function App() {
  const darkMode = useDarkMode();
  const theme = makeTheme(darkMode);
  const sideNavTheme = makeTheme(!darkMode);
  const useStyles = makeStyles();
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className={classes.root}>
          <ThemeProvider theme={sideNavTheme}>
            <AppSideNav />
          </ThemeProvider>

          <div className={classes.main}>
            <AppMain />
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
