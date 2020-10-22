import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { Grid, Divider, Tabs, Tab } from "@material-ui/core";
import _ from "lodash";

import { selectBenchmarkResultsById } from "../../../store";

import makeStyles from "./benchmark-comparison-styles";
import BenchmarkPlot from "../benchmark-plot";
import BenchmarkMetrics from "../benchmark-metrics-comparison";
import BenchmarkPopoverMenu from "../benchmark-popover-menu";

const useStyles = makeStyles();

function BenchmarkComparison({ benchmark, handleDelete, handleRerun }) {
  const analysis = useSelector(selectBenchmarkResultsById(benchmark.benchmark_id));
  const [metricsTab, setMetricsTab] = useState(0);
  const classes = useStyles();

  let { ranges, rangesX } = _.get(analysis, "baseline[0]", {
    ranges: [],
    rangesX: [],
  });

  const results = _.get(analysis, "baseline[0].results", []);
  const measurements = results.map((result) => result.measurements);

  const engineToName = (engine) => {
    if (engine === "neural_magic") {
      return "Neural Magic";
    } else if (engine === "ort_cpu") {
      return "ONNX Runtime CPU";
    }
  };

  return (
    <div className={classes.root}>
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        value={metricsTab}
        className={classes.tabs}
        onChange={(event, value) => {
          setMetricsTab(value);
        }}
      >
        {benchmark.inference_models.map((result, index) => {
          return <Tab key={index} label={engineToName(result.inference_engine)} />;
        })}
      </Tabs>
      <BenchmarkPopoverMenu handleDelete={handleDelete} handleRerun={handleRerun} />
      <Grid container direction="row">
        <Grid xs={2} item>
          <BenchmarkMetrics metrics={results} metricsIndex={metricsTab} />
        </Grid>
        <Divider orientation="vertical" flexItem className={classes.divider} />
        <Grid xs={10} item className={classes.chart}>
          <BenchmarkPlot
            measurements={measurements}
            ranges={ranges}
            rangesX={rangesX}
          />
        </Grid>
      </Grid>
    </div>
  );
}

BenchmarkComparison.propTypes = {
  benchmark: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleRerun: PropTypes.func.isRequired,
};

export default BenchmarkComparison;
