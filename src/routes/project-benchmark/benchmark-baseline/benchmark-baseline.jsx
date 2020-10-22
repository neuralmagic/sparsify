import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { Grid, Divider } from "@material-ui/core";
import _ from "lodash";

import { selectBenchmarkResultsById } from "../../../store";

import makeStyles from "./benchmark-baseline-styles";
import BenchmarkMetricsSingle from "../benchmark-metrics-single";
import BenchmarkPlot from "../benchmark-plot";
import BenchmarkPopoverMenu from "../benchmark-popover-menu";

const useStyles = makeStyles();

function BenchmarkBaseline({ benchmark, handleDelete, handleRerun }) {
  const analysis = useSelector(selectBenchmarkResultsById(benchmark.benchmark_id));
  const classes = useStyles();

  let { ranges, rangesX } = _.get(analysis, "baseline[0]", {
    ranges: [],
    rangesX: [],
  });

  const metrics = _.get(analysis, "baseline[0].results[0]", {});
  const { measurements } = metrics;

  return (
    <div className={classes.root}>
      <BenchmarkPopoverMenu handleDelete={handleDelete} handleRerun={handleRerun} />
      <Grid container direction="row">
        <Grid item xs={2}>
          <BenchmarkMetricsSingle metrics={metrics} />
        </Grid>
        <Divider orientation="vertical" flexItem className={classes.divider} />
        <Grid item className={classes.chart}>
          <BenchmarkPlot
            measurements={measurements ? [measurements] : []}
            ranges={ranges}
            rangesX={rangesX}
          />
        </Grid>
      </Grid>
    </div>
  );
}

BenchmarkBaseline.propTypes = {
  benchmark: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleRerun: PropTypes.func.isRequired,
};

export default BenchmarkBaseline;
