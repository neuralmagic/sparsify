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
