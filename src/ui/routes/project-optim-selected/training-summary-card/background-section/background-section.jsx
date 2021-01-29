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
