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

      {active && (
        <div>
          <Typography className={classes.iconText} variant="subtitle2" noWrap>
            {iconText}
          </Typography>
        </div>
      )}
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
      <ProgressIcon iconText="Upload your model into a new project" active={true}>
        <ModelIcon />
      </ProgressIcon>

      <ProgressLine progress={progress > 0 ? 100 : 0} />

      <ProgressIcon
        iconText="Profile your model for the effects of model optimizations on loss and performance"
        active={progress > 0}
      >
        <ProfileIcon />
      </ProgressIcon>

      <ProgressLine progress={progress > 1 ? 100 : 0} />
      <ProgressIcon
        iconText="Create an automatic model optimization configuration and edit further if desired"
        active={progress > 1}
      >
        <OptimIcon />
      </ProgressIcon>

      <ProgressLine progress={progress > 2 ? 100 : 0} />

      <ProgressIcon
        iconText="Export the configuration and integrate it into your current training flow"
        active={progress > 2}
      >
        <OpenInNewIcon />
      </ProgressIcon>
    </div>
  );
}

ProgressHeader.propTypes = {
  progress: PropTypes.number,
};

export default ProgressHeader;
