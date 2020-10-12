import React from "react";
import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";

import { ReactComponent as ModelIcon } from "../img/model.svg";
import { ReactComponent as OptimIcon } from "../img/optim.svg";
import { ReactComponent as ProfileIcon } from "../img/profile.svg";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

import makeStyles from "./progress-header-styles";

const useStyles = makeStyles();

function ProgressLine({ progress }) {
  const classes = useStyles();

  if (!progress || progress < 0) {
    progress = 0;
  } else if (progress > 100) {
    progress = 100;
  }

  return (
    <div className={classes.progressLineContainer}>
      <div className={classes.backgroundLine} />
      <div
        className={classes.progressLine}
        style={{ width: "100%", height: `${progress}%` }}
      />
    </div>
  );
}

ProgressLine.propTypes = {
  progress: PropTypes.number,
};

function ProgressIcon({ children, iconText, active }) {
  const classes = useStyles({ active });

  return (
    <div className={classes.iconGroup}>
      <div className={classes.iconContainer}>
        <div className={classes.iconWrapper}>{children}</div>
      </div>
      <div>
        <Typography className={classes.iconText} variant="subtitle2" noWrap>
          {iconText}
        </Typography>
      </div>
    </div>
  );
}

ProgressIcon.propTypes = {
  children: PropTypes.node.isRequired,
  iconText: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

function ProgressHeader({ progress }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ProgressLine progress={progress > 0 ? 100 : 1} />

      <ProgressIcon iconText="Model" active={progress > 0}>
        <ModelIcon />
      </ProgressIcon>

      <ProgressLine progress={progress > 1 ? 100 : 0} />

      <ProgressIcon iconText="Profile" active={progress > 1}>
        <ProfileIcon />
      </ProgressIcon>

      <ProgressLine progress={progress > 2 ? 100 : 0} />
      <ProgressIcon iconText="Optimization" active={progress > 2}>
        <OptimIcon />
      </ProgressIcon>

      <ProgressLine progress={progress > 3 ? 100 : 0} />

      <ProgressIcon iconText="Export" active={progress > 3}>
        <OpenInNewIcon />
      </ProgressIcon>
    </div>
  );
}

ProgressHeader.propTypes = {
  progress: PropTypes.number,
};

export default ProgressHeader;
