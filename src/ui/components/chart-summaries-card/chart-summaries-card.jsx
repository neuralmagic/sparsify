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

import React, { useState } from "react";
import { CardContent, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import PropTypes from "prop-types";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";

import makeStyles from "./chart-summaries-card-styles";
import { referenceLightTheme } from "../../app/app-theme";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { adjustColorOpacity, readableNumber } from "../utils";

const useStyles = makeStyles();
const valueDisplayOptions = [
  {
    value: "values",
    label: "values",
  },
  {
    value: "valuesLog",
    label: "log(values)",
  },
  {
    value: "valuesPercent",
    label: "(values)%",
  },
];

function ChartSummariesCard({ plotType, summaries, xAxisTitle, tooltipValues }) {
  const classes = useStyles();

  const [valueDisplay, setValueDisplay] = useState("values");
  const [summaryType, setSummaryType] = useState("");

  const summariesTypes = summaries ? Object.keys(summaries) : [];

  if (
    summariesTypes.length &&
    (!summaryType || summariesTypes.indexOf(summaryType) < 0)
  ) {
    setSummaryType(summariesTypes[0]);
  }

  const selected =
    summaryType && summaries.hasOwnProperty(summaryType)
      ? summaries[summaryType]
      : null;

  const selectedObjects =
    selected && selected.hasOwnProperty(valueDisplay)
      ? selected[valueDisplay].objects
      : [];
  const selectedRanges =
    selected && selected.hasOwnProperty(valueDisplay)
      ? selected[valueDisplay].ranges
      : [];
  const selectedRangeMax =
    selectedRanges && selectedRanges.length > 0
      ? selectedRanges[selectedRanges.length - 1]
      : null;
  const selectedRangeMin =
    selectedRanges && selectedRanges.length > 0 ? selectedRanges[0] : null;

  let summaryTypeLabel = summaryType;

  if (valueDisplay === "valuesLog") {
    summaryTypeLabel = `log(${summaryTypeLabel})`;
  } else if (valueDisplay === "valuesPercent") {
    summaryTypeLabel = `(${summaryTypeLabel})%`;
  }

  function tooltip(val) {
    const data = val.hasOwnProperty("data") ? val.data : val.point.data;
    const color = val.hasOwnProperty("color") ? val.color : val.point.borderColor;

    if (data.y) {
      data.y = data.y.toLocaleString(navigator.language, { maximumFractionDigits: 3 });
    }

    const innerHtml = (
      <div className={classes.tooltipLayout}>
        <div className={classes.tooltipHeader}>
          <div
            style={{ backgroundColor: color }}
            className={classes.tooltipHeaderColor}
          />
          <Typography color="textSecondary" variant="subtitle2">
            {summaryTypeLabel}
          </Typography>
        </div>

        <div>
          {[...tooltipValues, { key: "y", display: summaryTypeLabel }].map((val) => (
            <div className={classes.tooltipValueRow} key={val.key}>
              <Typography
                color="textSecondary"
                variant="subtitle2"
                className={classes.tooltipValueRowLabel}
              >
                {val.display}:
              </Typography>
              <Typography color="textPrimary" variant="subtitle2">
                {data[val.key]}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    );

    return plotType === "line" ? (
      <Card elevation={2} className={classes.tooltipRoot}>
        {innerHtml}
      </Card>
    ) : (
      innerHtml
    );
  }

  return (
    <Card elevation={1} className={classes.root}>
      <CardContent className={classes.layout}>
        <div className={classes.header}>
          <TextField
            id="summaryType"
            variant="outlined"
            select
            label="Summary Type"
            value={summaryType}
            onChange={(e) => setSummaryType(e.target.value)}
            className={classes.headerSelect}
          >
            {summariesTypes.length ? (
              summariesTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))
            ) : (
              <MenuItem key={"none"} value={"none"}>
                none
              </MenuItem>
            )}
          </TextField>
          <TextField
            id="valueDisplay"
            variant="outlined"
            select
            label="Value Display"
            value={valueDisplay}
            onChange={(e) => setValueDisplay(e.target.value)}
            className={classes.headerSelect}
          >
            {valueDisplayOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className={classes.chart}>
          <div className={classes.chartYAxis}>
            <Typography
              color="textSecondary"
              variant="subtitle2"
              className={classes.chartYAxisNumberTop}
            >
              {readableNumber(selectedRangeMax, 1)}
            </Typography>
            <div className={classes.chartYAxisTitle}>
              <div className={classes.chartYAxisTitleRotation}>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                  className={classes.chartYAxisNumberBottom}
                  noWrap
                >
                  {summaryTypeLabel}
                </Typography>
              </div>
            </div>
            <Typography
              color="textSecondary"
              variant="subtitle2"
              className={classes.chartYAxisNumberBottom}
            >
              {readableNumber(selectedRangeMin, 1)}
            </Typography>
          </div>
          {plotType === "bar" && (
            <ResponsiveBar
              data={selectedObjects}
              keys={["value"]}
              indexBy="label"
              margin={{ top: 24, right: 8, bottom: 24, left: 8 }}
              colors={[
                adjustColorOpacity(referenceLightTheme.palette.primary.main, 0.8),
              ]}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 0,
                tickPadding: 8,
                tickRotation: 0,
                legend: "",
              }}
              axisLeft={null}
              gridYValues={selectedRanges}
              enableLabel={false}
              animate={true}
              tooltip={tooltip}
              minValue={selectedRangeMin ? selectedRangeMin : "auto"}
              maxValue={selectedRangeMax ? selectedRangeMax : "auto"}
            />
          )}
          {plotType === "line" && (
            <ResponsiveLine
              data={[{ id: summaryType, data: selectedObjects }]}
              xScale={{ type: "point" }}
              yScale={{
                type: "linear",
                min:
                  selectedRangeMin === 0 || selectedRangeMin
                    ? selectedRangeMin
                    : "auto",
                max:
                  selectedRangeMax === 0 || selectedRangeMax
                    ? selectedRangeMax
                    : "auto",
              }}
              curve="monotoneX"
              colors={[
                adjustColorOpacity(referenceLightTheme.palette.primary.main, 0.8),
              ]}
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
            />
          )}
        </div>
        <div className={classes.chartXAxis}>
          <Typography color="textSecondary" variant="subtitle2">
            {xAxisTitle}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}

ChartSummariesCard.propTypes = {
  plotType: PropTypes.oneOf(["bar", "line"]).isRequired,
  summaries: PropTypes.object,
  xAxisTitle: PropTypes.string,
  tooltipValues: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ChartSummariesCard;
