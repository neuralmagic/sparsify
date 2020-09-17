import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";
import { ThemeProvider } from "@material-ui/core/styles";

import makeTheme, { useDarkMode } from "./app-theme";
import AppSideNav from "./sidenav";
import { makeContentRoutes, makeRouteTransitionOpacity } from "../routes";
import makeStyles from "./app-styles";

function App() {
  const darkMode = useDarkMode();
  const theme = makeTheme(darkMode);
  const sideNavTheme = makeTheme(!darkMode);
  const useStyles = makeStyles();
  const classes = useStyles();

  const routes = makeContentRoutes();
  const transition = makeRouteTransitionOpacity();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className={classes.root}>
          <ThemeProvider theme={sideNavTheme}>
            <AppSideNav />
          </ThemeProvider>

          <div className={classes.main}>
            <AnimatedSwitch
              atEnter={transition.atEnter}
              atLeave={transition.atLeave}
              atActive={transition.atActive}
              mapStyles={transition.mapStyles}
            >
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  component={route.component}
                  exact={route.exact}
                />
              ))}
            </AnimatedSwitch>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
