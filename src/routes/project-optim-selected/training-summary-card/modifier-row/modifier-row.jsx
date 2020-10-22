import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";

import makeStyles from "./modifier-row-styles";

const useStyles = makeStyles();

const ModifierRow = ({ name, start, end, globalStart, globalEnd }) => {
  const classes = useStyles();

  if (end < 0) {
    end = globalEnd;
  }

  if (start < 0) {
    start = globalStart;
  }

  const percentTotal = (end - start) / (globalEnd - globalStart);
  const percentBeforeStart = start / (globalEnd - globalStart);

  return (
    <div className={classes.modifier}>
      <div className={classes.modifierLabelContainer}>
        <div className={classes.modifierLabelWrapper}>
          <Typography
            className={classes.modifierLabel}
            color="textPrimary"
            variant="subtitle2"
            noWrap
          >
            {name}
          </Typography>
        </div>
      </div>

      <div className={classes.modifierBackground}>
        <div
          className={classes.modifierActive}
          style={{
            width: `${percentTotal * 100}%`,
            marginLeft: `${percentBeforeStart * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

ModifierRow.propTypes = {
  name: PropTypes.string.isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  globalStart: PropTypes.number.isRequired,
  globalEnd: PropTypes.number.isRequired,
};

export default ModifierRow;
