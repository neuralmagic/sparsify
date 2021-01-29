/*
Copyright (c) 2021 - present / Neuralmagic, Inc. All Rights Reserved.

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

BenchmarkMetricsScaling.propTypes = {
  metrics: PropTypes.object.isRequired,
  scale: PropTypes.string.isRequired,
};

export default BenchmarkMetricsScaling;
