import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import { Grid } from "@material-ui/core";
import DisplayMetric from "../../../components/display-metric";
import { formatWithMantissa } from "../../../components";

import makeStyles from "./benchmark-metrics-comparison-styles";

const useStyles = makeStyles();

function BenchmarkMetricsComparison({ metrics, metricsIndex }) {
  const classes = useStyles();

  const speedup =
    metrics.length > 0
      ? _.get(metrics, `[${metrics.length - 1 - metricsIndex}].msPerItem`, 1) /
        _.get(metrics, `[${metricsIndex}].msPerItem`, 1)
      : null;

  return (
    <Grid container direction="column">
      <DisplayMetric title="Est. Speedup" size="large" rootClass={classes.metric}>
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

BenchmarkMetricsComparison.propTypes = {
  metrics: PropTypes.array.isRequired,
  metricsIndex: PropTypes.number.isRequired,
};

export default BenchmarkMetricsComparison;
