import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";

import makeStyles from "./background-divider-styles";

const useStyles = makeStyles();

const BackgroundDivider = ({ epoch }) => {
  const classes = useStyles();

  return (
    <div className={classes.backgroundDivider}>
      <Typography
        color="textSecondary"
        variant="subtitle2"
        className={classes.backgroundDividerLabel}
      >
        {epoch}
      </Typography>
    </div>
  );
};

BackgroundDivider.propTypes = {
  epoch: PropTypes.number.isRequired,
};

export default BackgroundDivider;
