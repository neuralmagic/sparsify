import React from "react";
import { Route } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";
import { Paper, Button, Typography, IconButton } from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

import { makeRouteTransitionOpacity, makeSideNavRoutes } from "../../routes";
import makeStyles from "./sidenav-styles";
import { ReactComponent as NMLogo } from "./img/logo.svg";

const useStyles = makeStyles();

function AppSideNav({ onInfoClick }) {
  const classes = useStyles();

  const routes = makeSideNavRoutes();
  const transition = makeRouteTransitionOpacity();

  return (
    <Paper className={classes.root} elevation={20}>
      <div className={classes.info}>
        <IconButton size="small" className={classes.infoButton} onClick={() => onInfoClick()}>
          <InfoOutlinedIcon />
        </IconButton>
      </div>
      <div className={classes.header}>
        <div className={classes.logo}>
          <NMLogo />
        </div>
        <Typography className={classes.title}>Sparsify</Typography>
        <Typography className={classes.trademark}>TM</Typography>

      </div>
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
    </Paper>
  );
}

export default AppSideNav;
