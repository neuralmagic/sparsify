import React from "react";
import { useDispatch, useSelector } from "react-redux";

import ScrollerLayout from "../../components/scroller-layout";
import makeStyles from "./project-loss-styles";

const useStyles = makeStyles();

function ProjectLoss() {
  const classes = useStyles();
  const dispatch = useDispatch();

  return <ScrollerLayout layoutClass={classes.root}>loss profile</ScrollerLayout>;
}

export default ProjectLoss;
