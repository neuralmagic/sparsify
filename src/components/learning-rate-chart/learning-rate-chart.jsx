import React from "react";
import { Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import PropTypes from "prop-types";
import { ResponsiveLine } from "@nivo/line";

import makeStyles from "./learning-rate-chart-styles";
import { referenceLightTheme } from "../../app/app-theme";
import {adjustColorOpacity, readableNumber, scientificNumber} from "../utils";

const useStyles = makeStyles();

function LearningRateChart({ lrSummaries }) {
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
  const epochStart = selectedObjects ? selectedObjects[0].x : null;
  const epochEnd = selectedObjects
    ? selectedObjects[selectedObjects.length - 1].x
    : null;

  function tooltip(val) {
    const data = val.hasOwnProperty("data") ? val.data : val.point.data;
    const color = val.hasOwnProperty("color") ? val.color : val.point.borderColor;

    const innerHtml = (
      <div className={classes.tooltipLayout}>
        <div className={classes.tooltipHeader}>
          <div
            style={{ backgroundColor: color }}
            className={classes.tooltipHeaderColor}
          />
          <Typography color="textSecondary" variant="subtitle2">Learning Rate</Typography>
        </div>

        <div>
          <div className={classes.tooltipValueRow}>
            <Typography
                color="textSecondary"
                variant="subtitle2"
                className={classes.tooltipValueRowLabel}
            >
              LR:
            </Typography>
            <Typography color="textPrimary" variant="subtitle2">
              {data.value ? scientificNumber(data.value, 4) : "--"}
            </Typography>
          </div>
          <div className={classes.tooltipValueRow}>
            <Typography
                color="textSecondary"
                variant="subtitle2"
                className={classes.tooltipValueRowLabel}
            >
              Epoch:
            </Typography>
            <Typography color="textPrimary" variant="subtitle2">
              {data.x}
            </Typography>
          </div>
        </div>
      </div>
    );

    return (
      <Card elevation={2} className={classes.tooltipRoot}>
        {innerHtml}
      </Card>
    );
  }

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
          yScale={{ type: "linear", min: "auto", max: "auto" }}
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
          tooltip={tooltip}
          minValue={selectedRangeMin ? selectedRangeMin : "auto"}
          maxValue={selectedRangeMax ? selectedRangeMax : "auto"}
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

LearningRateChart.propTypes = {
  lrSummaries: PropTypes.object.isRequired,
};

export default LearningRateChart;
