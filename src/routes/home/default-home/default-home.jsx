import React from "react";

import { ReactComponent as NMLogo } from "../img/logo.svg";
import { Typography, Grid } from "@material-ui/core";
import makeStyles from "./default-home-styles";
import AbsoluteLayout from "../../../components/absolute-layout";

const useStyles = makeStyles();

function DefaultHome() {
  const classes = useStyles();
  return (
    <AbsoluteLayout spacingTop={4} spacingBottom={4} spacingRight={4} spacingLeft={4}>
      <div className={classes.root}>
        <div className={classes.layout}>
          <div className={classes.logoHeader}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={6}>
                <NMLogo className={classes.icon} />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h2" className={classes.title}>
                  Neural
                </Typography>
                <Typography variant="h2" className={classes.title}>
                  Magic
                </Typography>
              </Grid>
            </Grid>
          </div>
          <Typography
            color="textPrimary"
            variant="h5"
            align="center"
            className={classes.desc}
          >
            Welcome to Neural Magic Sparsify! Are you ready to improve model performance
            for deployment at scale, using the latest model compression techniques?
          </Typography>
          <Typography
            color="textPrimary"
            variant="h5"
            align="center"
            className={classes.desc}
          >
            Get started by clicking the “new project” button to profile, benchmark, and
            optimize your neural network for production. Or select an already-started
            project on the left.
          </Typography>
        </div>
      </div>
    </AbsoluteLayout>
  );
}

export default DefaultHome;
