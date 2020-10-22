import React, { useState } from "react";

import _ from "lodash";

import { Grid, IconButton, Divider, Popover, Button } from "@material-ui/core";
import DisplayMetric from "../../../components/display-metric";
import { formatWithMantissa } from "../../../components";

import makeStyles from "./benchmark-metrics-comparison-styles";

const useStyles = makeStyles();

function BenchmarkMetricsComparison({ metrics, metricsIndex }) {
  const classes = useStyles();

  const speedup =
    _.get(metrics, `[${metrics.length - 1 - metricsIndex}].msPerItem`, 1) /
    _.get(metrics, `[${metricsIndex}].msPerItem`, 1);
  return (
    <Grid container direction="column">
      <DisplayMetric title="Estimated Speedup" size="large" rootClass={classes.metric}>
        {`${formatWithMantissa(2, speedup)}x`}
      </DisplayMetric>
      <DisplayMetric title="MS per item" size="large" rootClass={classes.metric}>
        {formatWithMantissa(2, _.get(metrics, `[${metricsIndex}].msPerItem`))}
      </DisplayMetric>
      <DisplayMetric title="MS per batch" size="large" rootClass={classes.metric}>
        {formatWithMantissa(2, _.get(metrics, `[${metricsIndex}].msPerBatch`))}
      </DisplayMetric>
    </Grid>
  );
}

export default BenchmarkMetricsComparison;
