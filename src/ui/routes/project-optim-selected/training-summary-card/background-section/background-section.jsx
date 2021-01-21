import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";

import makeStyles from "./background-section-styles";
import BackgroundDivider from "../background-divider";

const useStyles = makeStyles();

const BackgroundSection = ({ width, label, startEpoch, colorClass }) => {
  const classes = useStyles();

  return (
    <div className={classes.backgroundSection} style={{ width: `${width * 100}%` }}>
      <div className={classes.backgroundSectionLabelContainer}>
        <Typography
          color="textSecondary"
          variant="subtitle2"
          className={classes.backgroundSectionLabel}
        >
          {label}
        </Typography>
        <div className={classes.backgroundSectionLabelTick} />
      </div>

      <BackgroundDivider epoch={startEpoch} />

      <div className={`${colorClass} ${classes.backgroundSectionFill}`} />
    </div>
  );
};

BackgroundSection.propTypes = {
  width: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  startEpoch: PropTypes.number.isRequired,
  colorClass: PropTypes.string.isRequired,
};

export default BackgroundSection;
