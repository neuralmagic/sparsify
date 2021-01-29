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
