import React from "react";
import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";

import { ReactComponent as ModelIcon } from "../img/model.svg";
import { ReactComponent as ProjectIcon } from "../img/project.svg";
import { ReactComponent as ProfileIcon } from "../img/profile.svg";

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
      <div className={classes.progressLine} style={{ width: `${progress}%` }} />
    </div>
  );
}

ProgressLine.propTypes = {
  progress: PropTypes.number,
};

function ProgressIcon({ children, iconText, active }) {
  const classes = useStyles({ active });

  return (
    <div className={classes.iconContainer}>
      <div className={classes.iconWrapper}>{children}</div>
      <Typography className={classes.iconText} variant="subtitle2" noWrap>
        {iconText}
      </Typography>
    </div>
  );
}

ProgressIcon.propTypes = {
  children: PropTypes.node.isRequired,
  iconText: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

function ProgressHeader({ progressModel, progressProject, progressProfile }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ProgressLine progress={100} />
      <ProgressIcon iconText="Select Model" active={true}>
        <ModelIcon />
      </ProgressIcon>
      <ProgressLine progress={progressModel} />
      <ProgressIcon
        iconText="Name Project"
        active={progressProject !== null && progressProject !== undefined}
      >
        <ProjectIcon />
      </ProgressIcon>
      <ProgressLine progress={progressProject} />
      <ProgressIcon
        iconText="Profile Model"
        active={progressProfile !== null && progressProfile !== undefined}
      >
        <ProfileIcon />
      </ProgressIcon>
      <ProgressLine progress={progressProfile} />
    </div>
  );
}

ProgressHeader.propTypes = {
  progressModel: PropTypes.number,
  progressProject: PropTypes.number,
  progressProfile: PropTypes.number,
};

export default ProgressHeader;
