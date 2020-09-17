import React from "react";
import { Route } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";
import Box from "@material-ui/core/Box";

import { makeRouteTransitionOpacity, makeSideNavRoutes } from "../../routes";
import makeStyles from "./sidenav-styles";
import { ReactComponent as NMLogo } from "./img/logo.svg";

function AppSideNav() {
  const useStyles = makeStyles();
  const classes = useStyles();

  const routes = makeSideNavRoutes();
  const transition = makeRouteTransitionOpacity();

  return (
    <Box className={classes.root} boxShadow={16}>
      <div className={classes.header}>
        <div className={classes.logo}>
          <NMLogo />
        </div>
        <span className={classes.title}>Sparsify</span>
        <span className={classes.trademark}>TM</span>
      </div>
      <div className={classes.divider} />
      <div className={classes.body}>
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
    </Box>
  );
}

export default AppSideNav;
