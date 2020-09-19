import React from "react";
import { Typography } from "@material-ui/core";

import { ReactComponent as Icon } from "./img/icon.svg";
import AbsoluteLayout from "../../components/absolute-layout";
import makeStyles from "./project-benchmark-styles";

const useStyles = makeStyles();

function ProjectBenchmark() {
  const classes = useStyles();

  return (
    <AbsoluteLayout spacingTop={4} spacingBottom={4} spacingRight={4} spacingLeft={4}>
      <div className={classes.root}>
        <div className={classes.layout}>
          <div className={classes.icon}>
            <Icon />
          </div>
          <Typography color="textSecondary" variant="h3" align="center">
            Model Benchmarking
          </Typography>

          <Typography
            color="textSecondary"
            variant="h5"
            align="center"
            className={classes.desc}
          >
            Coming soon
          </Typography>
        </div>
      </div>
    </AbsoluteLayout>
  );
}

export default ProjectBenchmark;
