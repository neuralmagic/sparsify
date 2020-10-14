import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Grid, Divider, Tabs, Tab } from "@material-ui/core";
import _ from "lodash";

import { selectBenchmarkResultsById } from "../../../store";

import makeStyles from "./benchmark-comparison-styles";
import BenchmarkPlot from "../benchmark-plot";
import BenchmarkMetrics from "../benchmark-metrics-comparison";
import BenchmarkPopoverMenu from "../benchmark-popover-menu";

const useStyles = makeStyles();

function BenchmarkComparison({ benchmark, handleDelete }) {
  const analysis = useSelector(selectBenchmarkResultsById(benchmark.benchmark_id));
  const [metricsTab, setMetricsTab] = useState(0);
  const classes = useStyles();

  let { ranges, rangesX } = _.get(analysis, "baseline[0]", {});

  const results = _.get(analysis, "baseline[0].results", []);
  const measurements = results.map((result) => result.measurements);

  const engineToName = (engine) => {
    if (engine === "neural_magic") {
      return "Neural Magic";
    } else if (engine === "ort_cpu") {
      return "ONNX Runtime CPU";
    }
  };

  const renderPlot =
    measurements && _.get(ranges, "length", 0) > 0 && _.get(rangesX, "length", 0) > 0;

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
        {results.map((result, index) => {
          return <Tab key={index} label={engineToName(result.inferenceEngine)} />;
        })}
      </Tabs>
      <BenchmarkPopoverMenu handleDelete={handleDelete} />
      {renderPlot && (
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
      )}
    </div>
  );
}

export default BenchmarkComparison;
