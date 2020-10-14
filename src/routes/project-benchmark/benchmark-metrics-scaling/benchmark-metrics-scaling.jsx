import React from "react";

import _ from "lodash";

import { Grid } from "@material-ui/core";
import DisplayMetric from "../../../components/display-metric";
import { formatWithMantissa } from "../../../components";

import makeStyles from "./benchmark-metrics-scaling-styles";

const useStyles = makeStyles();

function BenchmarkMetricsScaling({ metrics, scale }) {
  const classes = useStyles();

  const minMetric = Math.max(...metrics.data.map((metric) => metric.y));
  const minData = metrics.data.find((metric) => metric.y === minMetric);
  const maxMetric = Math.min(...metrics.data.map((metric) => metric.y));
  const maxData = metrics.data.find((metric) => metric.y === maxMetric);

  return (
    <Grid container direction="column">
      <DisplayMetric
        title={`Best Perf. ${scale}`}
        size="large"
        rootClass={classes.metric}
      >
        {maxData.x}
      </DisplayMetric>
      <DisplayMetric title="MS per item" size="large" rootClass={classes.metric}>
        {formatWithMantissa(2, maxMetric)}
      </DisplayMetric>
      <DisplayMetric
        title={`Worst Perf. ${scale}`}
        size="large"
        rootClass={classes.metric}
      >
        {minData.x}
      </DisplayMetric>
    </Grid>
  );
}

export default BenchmarkMetricsScaling;
