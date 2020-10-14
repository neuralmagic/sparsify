import React, { useState } from "react";

import { Grid, IconButton, Divider, Popover, Button } from "@material-ui/core";
import DisplayMetric from "../../../components/display-metric";
import { formatWithMantissa } from "../../../components";

import makeStyles from "./benchmark-metrics-single-styles";

const useStyles = makeStyles();

function BenchmarkMetricsSingle({ metrics }) {
  const classes = useStyles();
  const { msPerItem, msPerBatch, itemsPerSecond } = metrics;
  return (
    <Grid container direction="column">
      <DisplayMetric title="MS per item" size="large" rootClass={classes.metric}>
        {formatWithMantissa(2, msPerItem)}
      </DisplayMetric>
      <DisplayMetric title="MS per batch" size="large" rootClass={classes.metric}>
        {formatWithMantissa(2, msPerBatch)}
      </DisplayMetric>
      <DisplayMetric title="Items per second" size="large" rootClass={classes.metric}>
        {formatWithMantissa(2, itemsPerSecond)}
      </DisplayMetric>
    </Grid>
  );
}

export default BenchmarkMetricsSingle;
