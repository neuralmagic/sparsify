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
import { ResponsiveLine } from "@nivo/line";

import _ from "lodash";
import { referenceLightTheme } from "../../../app/app-theme";
import { adjustColorOpacity, readableNumber } from "../../../components/utils";
import makeStyles from "./benchmark-plot-styles";
import { Card, Typography } from "@material-ui/core";
import { formatWithMantissa } from "../../../components";

const useStyles = makeStyles();

function BenchmarkPlot({ measurements, ranges, rangesX, xAxisLabel, yAxisLabel }) {
  let rangeMaxValue,
    rangeMinValue = null;
  if (ranges.length > 2) {
    rangeMinValue = ranges[0];
    rangeMaxValue = ranges[ranges.length - 1];
  }

  let rangeMaxXValue,
    rangeMinXValue = null;
  if (ranges.length > 2) {
    rangeMinXValue = rangesX[0];
    rangeMaxXValue = rangesX[rangesX.length - 1];
  }

  const classes = useStyles();

  const toolTip = (val) => {
    const data = val.data ? val.data : val.point.data;
    const color = _.get(
      val,
      "point.serieColor",
      adjustColorOpacity(referenceLightTheme.palette.primary.main, 0.8)
    );
    let keys = [];
    if (data.type === "baseline" || data.type === "scaling") {
      keys = [
        {
          value: "inferenceOptimization",
          label: "Optimization Version",
        },
        {
          value: "inferenceEngine",
          label: "Inference Engine",
        },
      ];
    }

    return (
      <Card elevation={10} className={classes.tooltipRoot}>
        <div className={classes.tooltipLayout}>
          <div className={classes.tooltipHeader}>
            <div
              style={{ backgroundColor: color }}
              className={classes.tooltipHeaderColor}
            />
            <Typography color="textSecondary" variant="subtitle2">
              {yAxisLabel}
            </Typography>
          </div>
          <div>
            <div className={classes.tooltipValueRow}>
              <Typography
                color="textSecondary"
                variant="subtitle2"
                className={classes.tooltipValueRowLabel}
              >
                {`${yAxisLabel}:`}
              </Typography>
              <Typography color="textPrimary" variant="subtitle2">
                {data.y === 0 ? 0 : formatWithMantissa(2, data.y)}
              </Typography>
            </div>
            <div className={classes.tooltipValueRow}>
              <Typography
                color="textSecondary"
                variant="subtitle2"
                className={classes.tooltipValueRowLabel}
              >
                {`${xAxisLabel}:`}
              </Typography>
              <Typography color="textPrimary" variant="subtitle2">
                {data.x === 0
                  ? 0
                  : data.type === "baseline" || data.type === "scaling"
                  ? formatWithMantissa(0, data.x)
                  : formatWithMantissa(2, data.x)}
              </Typography>
            </div>

            {keys.map(({ value, label }) => {
              return (
                <div className={classes.tooltipValueRow} key={value}>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    className={classes.tooltipValueRowLabel}
                  >
                    {label}:
                  </Typography>
                  <Typography color="textPrimary" variant="subtitle2">
                    {data[value] || "None"}
                  </Typography>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    );
  };

  const colors = [
    adjustColorOpacity(referenceLightTheme.palette.primary.main, 0.8),
    adjustColorOpacity(referenceLightTheme.palette.primary.main, 0.2),
  ];

  return (
    <div className={classes.root}>
      <div className={classes.chart}>
        <div className={classes.chartYAxis}>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            className={classes.chartYAxisNumberTop}
          >
            {readableNumber(rangeMaxValue, 1)}
          </Typography>
          <div className={classes.chartYAxisTitle}>
            <div className={classes.chartYAxisTitleRotation}>
              <Typography
                color="textSecondary"
                variant="subtitle2"
                className={classes.chartYAxisNumberBottom}
                noWrap
              >
                {yAxisLabel}
              </Typography>
            </div>
          </div>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            className={classes.chartYAxisNumberBottom}
          >
            {readableNumber(rangeMinValue, 1)}
          </Typography>
        </div>
        <ResponsiveLine
          data={measurements}
          xScale={{ type: "linear", min: "auto" }}
          yScale={{
            type: "linear",
            min: rangeMinValue === 0 || rangeMinValue ? rangeMinValue : "auto",
            max: rangeMaxValue === 0 || rangeMaxValue ? rangeMaxValue : "auto",
          }}
          lineWidth={2}
          enablePoints={true}
          pointSize={6}
          pointColor={referenceLightTheme.palette.background.paper}
          pointBorderWidth={2}
          pointBorderColor={adjustColorOpacity(
            referenceLightTheme.palette.primary.main,
            0.5
          )}
          colors={colors}
          enableGridX={false}
          enableGridY={true}
          axisBottom={null}
          axisLeft={null}
          axisTop={null}
          axisRight={null}
          gridYValues={ranges}
          margin={{ top: 24, right: 8, bottom: 24, left: 8 }}
          isInteractive={true}
          enableCrosshair={false}
          useMesh={true}
          animate={true}
          tooltip={toolTip}
        />
      </div>
      <div className={classes.chartXAxis}>
        <Typography color="textSecondary" variant="subtitle2">
          {rangeMinXValue}
        </Typography>
        <Typography
          color="textSecondary"
          variant="subtitle2"
          className={classes.chartXAxisTitle}
        >
          {xAxisLabel}
        </Typography>
        <Typography color="textSecondary" variant="subtitle2">
          {rangeMaxXValue}
        </Typography>
      </div>

      {measurements.length > 1 && (
        <div className={classes.legendRoot}>
          {measurements.map((measurement, index) => (
            <div className={classes.legendRow} key={index}>
              <div
                className={classes.legendColor}
                style={{ backgroundColor: colors[index] }}
              />
              <Typography variant="body2" className={classes.legendLabel}>
                {measurement.id}
              </Typography>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

BenchmarkPlot.propTypes = {
  measurements: PropTypes.array.isRequired,
  ranges: PropTypes.array.isRequired,
  rangesX: PropTypes.array.isRequired,
  yAxisLabel: PropTypes.string,
  xAxisLabel: PropTypes.string,
};

BenchmarkPlot.defaultProps = {
  yAxisLabel: "MS per Batch",
  xAxisLabel: "Batch Iteration",
};

export default BenchmarkPlot;
