import React from "react";
import { Button, Typography } from "@material-ui/core";
import ChevronLeft from "@material-ui/icons/ChevronLeft";

import AbsoluteLayout from "../../components/absolute-layout";
import makeStyles from "./not-found-sidenav-styles";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles();

function NotFoundSideNav() {
  const classes = useStyles();
  const history = useHistory();
  return (
    <AbsoluteLayout layoutClass={classes.root}>
      <div className={classes.header}>
        <Button className={classes.headerButton} onClick={() => history.push("/")}>
          <ChevronLeft />
        </Button>
        <Typography color="textPrimary" className={classes.headerText} noWrap>
          Home
        </Typography>
      </div>
    </AbsoluteLayout>
  );
}

export default NotFoundSideNav;
