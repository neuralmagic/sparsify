/*
Copyright 2021-present Neuralmagic, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
