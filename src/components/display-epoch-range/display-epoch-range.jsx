import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";

import makeStyles from "./display-epoch-range-styles";
import DisplayTextField from "../display-text-field";

const useStyles = makeStyles();

function DisplayEpochRange({
  label,
  startEpoch,
  endEpoch,
  disabled,
  onStartEpochChange,
  onEndEpochChange,
  onStartFinished,
  onEndFinished,
}) {
  const classes = useStyles();

  return (
    <div className={classes.layout}>
      <Typography color="textSecondary" variant="subtitle2" className={classes.label}>
        {label}
      </Typography>
      <div className={classes.range}>
        <DisplayTextField
          disabled={disabled}
          label="Start"
          value={startEpoch}
          onValueChange={onStartEpochChange}
          onFinished={onStartFinished}
        />
        <div className={classes.dash} />
        <DisplayTextField
          disabled={disabled}
          label="End"
          value={endEpoch}
          onValueChange={onEndEpochChange}
          onFinished={onEndFinished}
        />
      </div>
    </div>
  );
}

DisplayEpochRange.propTypes = {
  label: PropTypes.string.isRequired,
  startEpoch: PropTypes.string.isRequired,
  endEpoch: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onStartEpochChange: PropTypes.func,
  onEndEpochChange: PropTypes.func,
  onStartFinished: PropTypes.func,
  onEndFinished: PropTypes.func,
};

export default DisplayEpochRange;
