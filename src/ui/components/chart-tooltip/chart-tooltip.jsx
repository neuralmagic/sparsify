/*
Copyright (c) 2021 - present / Neuralmagic, Inc. All Rights Reserved.

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
import Card from "@material-ui/core/Card";
import PropTypes from "prop-types";

import makeStyles from "./chart-tooltip-styles";

const useStyles = makeStyles();

function ChartTooltip({ color, title, displayMetrics, noCard }) {
  const classes = useStyles();

  const innerHtml = (
    <div className={classes.layout}>
      <div className={classes.header}>
        <div style={{ backgroundColor: color }} className={classes.headerColor} />
        <Typography color="textSecondary" variant="subtitle2">
          {title}
        </Typography>
      </div>

      <div className={classes.metrics}>
        {displayMetrics.map((metric) => (
          <div className={classes.metric}>
            <Typography
              color="textSecondary"
              variant="subtitle2"
              className={classes.metricLabel}
            >
              {metric.title}:
            </Typography>
            <Typography
              color="textPrimary"
              variant="subtitle2"
              className={classes.metricValue}
            >
              {metric.val}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={classes.positioning}>
      {noCard && innerHtml}
      {!noCard && (
        <Card elevation={2} className={classes.root}>
          {innerHtml}
        </Card>
      )}
    </div>
  );
}

ChartTooltip.propTypes = {
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  displayMetrics: PropTypes.arrayOf(PropTypes.object).isRequired,
  wrapCard: PropTypes.bool,
};

export default ChartTooltip;
