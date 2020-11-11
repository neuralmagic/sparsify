import React from "react";
import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { ResponsiveLine } from "@nivo/line";

import makeStyles from "./chart-learning-rate-styles";
import { referenceLightTheme } from "../../app/app-theme";
import { adjustColorOpacity, readableNumber } from "../utils";
import ChartTooltip from "../chart-tooltip";

const useStyles = makeStyles();

function createTooltip(val) {
  const data = val.hasOwnProperty("data") ? val.data : val.point.data;
  const color = val.hasOwnProperty("color") ? val.color : val.point.borderColor;
  const displayMetrics = [
    { title: "Epoch", val: data.x },
    { title: "LR", val: data.y },
  ];

  return (
    <ChartTooltip color={color} title="Learning Rate" displayMetrics={displayMetrics} />
  );
}

function ChartLearningRate({ lrSummaries }) {
  const classes = useStyles();

  const selected = lrSummaries.values;
  const selectedObjects = selected.objects;
  const selectedRanges = selected.ranges;
  const selectedRangeMax =
    selectedRanges && selectedRanges.length > 0
      ? selectedRanges[selectedRanges.length - 1]
      : null;
  const selectedRangeMin =
    selectedRanges && selectedRanges.length > 0 ? selectedRanges[0] : null;
  const epochStart =
    selectedObjects && selectedObjects.length > 0 ? selectedObjects[0].x : null;
  const epochEnd =
    selectedObjects && selectedObjects.length > 0
      ? selectedObjects[selectedObjects.length - 1].x
      : null;

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
                Learning Rate
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
          data={[{ id: "Learning Rate", data: selectedObjects }]}
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
          {epochStart}
        </Typography>
        <Typography
          color="textSecondary"
          variant="subtitle2"
          className={classes.chartAxisTitle}
        >
          Epoch
        </Typography>
        <Typography
          color="textSecondary"
          variant="subtitle2"
          className={classes.chartYAxisNumber}
        >
          {epochEnd}
        </Typography>
      </div>
    </div>
  );
}

ChartLearningRate.propTypes = {
  lrSummaries: PropTypes.object.isRequired,
};

export default ChartLearningRate;
