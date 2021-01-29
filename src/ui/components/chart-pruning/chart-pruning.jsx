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
import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { ResponsiveLine } from "@nivo/line";

import makeStyles from "./chart-pruning-styles";
import { referenceLightTheme } from "../../app/app-theme";
import { adjustColorOpacity, readableNumber } from "../utils";
import ChartTooltip from "../chart-tooltip";

const useStyles = makeStyles();

function createTooltip(val) {
  const data = val.hasOwnProperty("data") ? val.data : val.point.data;
  const color = val.hasOwnProperty("color") ? val.color : val.point.borderColor;
  const displayMetrics = [
    { title: "Layer Index", val: data.x },
    { title: "Layer ID", val: data.id },
    { title: "Layer Type", val: data.op_type },
    { title: "Weight Name", val: data.weight_name },
    { title: "Sparsity", val: `${data.y}%` },
  ];

  return (
    <ChartTooltip color={color} title="Sparsity" displayMetrics={displayMetrics} />
  );
}

function ChartPruning({ layerSummaries }) {
  const classes = useStyles();

  const selected = layerSummaries.values;
  const selectedObjects = selected.objects;
  const selectedRanges = selected.ranges;
  const selectedRangeMax =
    selectedRanges && selectedRanges.length > 0
      ? selectedRanges[selectedRanges.length - 1]
      : null;
  const selectedRangeMin =
    selectedRanges && selectedRanges.length > 0 ? selectedRanges[0] : null;

  return (
    <div className={classes.root}>
      <div className={classes.chart}>
        <div className={classes.chartYAxis}>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            className={classes.chartYAxisNumber}
          >
            {readableNumber(selectedRangeMax, 1)}
          </Typography>
          <div className={classes.chartYAxisTitle}>
            <div className={classes.chartYAxisTitleRotation}>
              <Typography
                color="textSecondary"
                variant="subtitle2"
                className={classes.chartAxisTitle}
                noWrap
              >
                Sparsity
              </Typography>
            </div>
          </div>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            className={classes.chartYAxisNumber}
          >
            {readableNumber(selectedRangeMin, 1)}
          </Typography>
        </div>
        <ResponsiveLine
          data={[{ id: "Sparsity", data: selectedObjects }]}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: selectedRangeMin === 0 || selectedRangeMin ? selectedRangeMin : "auto",
            max: selectedRangeMax === 0 || selectedRangeMax ? selectedRangeMax : "auto",
          }}
          curve="monotoneX"
          colors={[adjustColorOpacity(referenceLightTheme.palette.primary.main, 0.8)]}
          lineWidth={2}
          enablePoints={true}
          pointSize={6}
          pointColor={referenceLightTheme.palette.background.paper}
          pointBorderWidth={2}
          pointBorderColor={adjustColorOpacity(
            referenceLightTheme.palette.primary.main,
            0.8
          )}
          enableGridX={false}
          enableGridY={true}
          gridYValues={selectedRanges}
          axisTop={null}
          axisRight={null}
          axisBottom={null}
          axisLeft={null}
          margin={{ top: 24, right: 8, bottom: 8, left: 8 }}
          isInteractive={true}
          enableCrosshair={false}
          useMesh={true}
          animate={true}
          tooltip={createTooltip}
        />
      </div>
      <div className={classes.chartXAxis}>
        <Typography
          color="textSecondary"
          variant="subtitle2"
          className={classes.chartYAxisNumber}
        >
          0
        </Typography>
        <Typography
          color="textSecondary"
          variant="subtitle2"
          className={classes.chartAxisTitle}
        >
          Layer Depth
        </Typography>
        <Typography
          color="textSecondary"
          variant="subtitle2"
          className={classes.chartYAxisNumber}
        >
          {selectedObjects.length - 1}
        </Typography>
      </div>
    </div>
  );
}

ChartPruning.propTypes = {
  layerSummaries: PropTypes.object.isRequired,
};

export default ChartPruning;
