import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { AnimatedRoute } from "react-router-transition";
import { ThemeProvider } from "@material-ui/core/styles";

import makeTheme, { useDarkMode } from "./app-theme";
import AppSideNav from "./sidenav";
import { createContentRoutes } from "../routes";
import makeStyles from "./app-styles";

function App() {
  const darkMode = useDarkMode();
  const theme = makeTheme(darkMode);
  const sideNavTheme = makeTheme(!darkMode);
  const useStyles = makeStyles();
  const classes = useStyles();

  const routes = createContentRoutes();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className={classes.root}>
          <ThemeProvider theme={sideNavTheme}>
            <AppSideNav />
          </ThemeProvider>

          <div className={classes.main}>
            <Switch>
              {routes.map((route) => (
                <AnimatedRoute
                  key={route.path}
                  path={route.path}
                  component={route.component}
                  exact={route.exact}
                  atEnter={route.transition.atEnter}
                  atLeave={route.transition.atLeave}
                  atActive={route.transition.atActive}
                  mapStyles={route.transition.mapStyles}
                />
              ))}
            </Switch>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
