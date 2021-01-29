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
import { Grid } from "@material-ui/core";
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

BenchmarkMetricsSingle.propTypes = {
  metrics: PropTypes.object.isRequired,
};

export default BenchmarkMetricsSingle;
