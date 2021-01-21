import React from "react";
import { Route } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";

import { makeContentRoutes, makeRouteTransitionOpacity } from "../../routes";
import ServerDownModal from "../../modals/server-down";
import makeStyles from "./main-styles";

const useStyles = makeStyles();

function AppMain() {
  const classes = useStyles();

  const routes = makeContentRoutes();
  const transition = makeRouteTransitionOpacity();

  return (
    <div className={classes.root}>
      <ServerDownModal />
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
  );
}

export default AppMain;
