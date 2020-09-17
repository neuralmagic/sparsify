import React from "react";
import { Switch } from "react-router-dom";
import { AnimatedRoute } from "react-router-transition";
import Box from "@material-ui/core/Box";

import { createSideNavRoutes } from "../../routes";
import makeStyles from "./sidenav-styles";
import { ReactComponent as NMLogo } from "./img/logo.svg";

function AppSideNav() {
  const useStyles = makeStyles();
  const classes = useStyles();
  const routes = createSideNavRoutes();

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
    </Box>
  );
}

export default AppSideNav;
