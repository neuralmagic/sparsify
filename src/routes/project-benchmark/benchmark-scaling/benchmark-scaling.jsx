import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import {
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
} from "@material-ui/core";
import _ from "lodash";
import { selectBenchmarkResultsById } from "../../../store";

import makeStyles from "./benchmark-scaling-styles";
import BenchmarkMetricsSingle from "../benchmark-metrics-single";
import BenchmarkMetricsComparison from "../benchmark-metrics-comparison";
import BenchmarkMetricsScaling from "../benchmark-metrics-scaling";
import BenchmarkPlot from "../benchmark-plot";
import BenchmarkPopoverMenu from "../benchmark-popover-menu";

const useStyles = makeStyles();

function BenchmarkScaling({ benchmark, handleDelete, handleRerun }) {
  const analysis = useSelector(selectBenchmarkResultsById(benchmark.benchmark_id));
  const classes = useStyles();
  const [scalingTab, setScalingTab] = useState(0);
  const [selectCore, setSelectCore] = useState();
  const [selectBatch, setSelectBatch] = useState();
  const [plotType, setPlotType] = useState("msPerItem");

  const plotTypes = [
    {
      value: "msPerItem",
      label: "MS Per Item",
    },
    {
      value: "msPerBatch",
      label: "MS Per Batch",
    },
    {
      value: "itemsPerSecond",
      label: "Items Per Second",
    },
  ];

  useEffect(() => {
    setSelectCore(
      benchmark.core_counts.length > 0 ? benchmark.core_counts[0] : undefined
    );
    setSelectBatch(
      benchmark.batch_sizes.length > 0 ? benchmark.batch_sizes[0] : undefined
    );
  }, [benchmark]);

  let ranges, rangesX, measurements, metrics;

  const baseline = _.get(analysis, "baseline", []).find(
    (result) => result.batchSize === selectBatch && result.coreCount === selectCore
  );

  let scaling;

  if (scalingTab === 0 && baseline) {
    let { results } = baseline;
    rangesX = _.get(baseline, "rangesX");
    ranges = _.get(baseline, "ranges");
    measurements = results.map((result) => result.measurements);
    metrics = baseline.results;
  } else if (scalingTab === 1) {
    scaling = _.get(analysis, `scaling.coreScaling[${selectBatch}][${plotType}]`, {});

    if (scaling) {
      rangesX = _.get(scaling, "rangesX");
      ranges = _.get(scaling, "ranges");
      measurements = _.get(scaling, "measurements");
    }
  } else if (scalingTab === 2) {
    scaling = _.get(analysis, `scaling.batchScaling[${selectCore}][${plotType}]`, {});

    if (scaling) {
      rangesX = _.get(scaling, "rangesX");
      ranges = _.get(scaling, "ranges");
      measurements = _.get(scaling, "measurements");
    }
  }

  let yAxisLabel = "MS per Batch";
  if (scalingTab !== 0) {
    yAxisLabel = plotTypes.find((plot) => plot.value === plotType).label;
  }
  let xAxisLabel = "Batch Iteration";

  if (scalingTab === 1) {
    xAxisLabel = "Cores";
  } else if (scalingTab === 2) {
    xAxisLabel = "Batch Size";
  }

  const renderPlot =
    measurements && _.get(ranges, "length", 0) > 0 && _.get(rangesX, "length", 0) > 0;

  return (
    <div className={classes.root}>
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        value={scalingTab}
        className={classes.tabs}
        onChange={(event, value) => {
          setScalingTab(value);
        }}
      >
        <Tab label="Baseline" />
        <Tab label="Core Scaling" />
        <Tab label="Batch Size Scaling" />
      </Tabs>
      <BenchmarkPopoverMenu handleDelete={handleDelete} handleRerun={handleRerun} />

      <Grid container direction="row">
        <Grid item xs={2}>
          {_.get(metrics, "length", 0) === 1 && scalingTab === 0 && (
            <BenchmarkMetricsSingle metrics={metrics[0]} />
          )}
          {_.get(metrics, "length", 0) === 2 && scalingTab === 0 && (
            <BenchmarkMetricsComparison metrics={metrics} metricsIndex={0} />
          )}
          {_.get(measurements, "length", 0) > 0 && scalingTab !== 0 && (
            <BenchmarkMetricsScaling
              metrics={measurements[0]}
              scale={scalingTab === 1 ? "Core" : "Batch Size"}
            />
          )}
        </Grid>
        <Divider orientation="vertical" flexItem className={classes.divider} />
        <Grid item xs={8} className={classes.chart}>
          {renderPlot && (
            <BenchmarkPlot
              measurements={measurements}
              ranges={ranges}
              rangesX={rangesX}
              xAxisLabel={xAxisLabel}
              yAxisLabel={yAxisLabel}
            />
          )}
        </Grid>

        <Grid
          item
          xs={2}
          container
          direction="row"
          className={classes.scalingSelection}
        >
          {selectCore !== undefined && scalingTab !== 1 && (
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="core-label">Cores</InputLabel>
                <Select
                  labelId="core-label"
                  label="Cores"
                  value={selectCore}
                  onChange={(event) => {
                    setSelectCore(event.target.value);
                  }}
                >
                  {benchmark.core_counts.map((core) => (
                    <MenuItem key={core} value={core}>
                      {core}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {selectBatch !== undefined && scalingTab !== 2 && (
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="batch-label">Batch Size</InputLabel>
                <Select
                  labelId="batch-label"
                  label="Batch Size"
                  value={selectBatch}
                  onChange={(event) => {
                    setSelectBatch(event.target.value);
                  }}
                >
                  {benchmark.batch_sizes.map((batch) => (
                    <MenuItem key={batch} value={batch}>
                      {batch}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

BenchmarkScaling.propTypes = {
  benchmark: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleRerun: PropTypes.func.isRequired,
};

export default BenchmarkScaling;
