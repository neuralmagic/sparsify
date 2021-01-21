import React from "react";
import { Typography } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import PropTypes from "prop-types";

import makeStyles from "./info-row-styles";

const useStyles = makeStyles();

function ProjectSettingsCardInfoRow({ label, value, className, showTooltip }) {
  const classes = useStyles();

  if (!className) {
    className = "";
  }

  const valueTypography = (
    <Typography color="textPrimary" className={classes.value} noWrap>
      {value}
    </Typography>
  );

  return (
    <div className={`${classes.root} ${className}`}>
      <Typography color="textSecondary" className={classes.label}>
        {label}
      </Typography>
      {showTooltip && (
        <Tooltip title={value ? value : ""} classes={{ tooltip: classes.valueTooltip }}>
          {valueTypography}
        </Tooltip>
      )}
      {!showTooltip && valueTypography}
    </div>
  );
}

ProjectSettingsCardInfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  className: PropTypes.string,
  showToolTip: PropTypes.bool,
};

export default ProjectSettingsCardInfoRow;
