/*
Copyright 2021-present Neuralmagic, Inc.

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

import makeStyles from "./background-styles";
import BackgroundSection from "../background-section";
import BackgroundDivider from "../background-divider";

const useStyles = makeStyles();

const Background = ({ pruningStart, pruningEnd, globalStart, globalEnd }) => {
  const classes = useStyles();

  if (pruningEnd < pruningStart) {
    pruningStart = globalEnd;
    pruningEnd = globalEnd;
  }

  const stabilizationPercent = pruningStart / (globalEnd - globalStart);
  const pruningPercent = (pruningEnd - pruningStart) / (globalEnd - globalStart);
  const fineTuningPercent = 1.0 - pruningPercent - stabilizationPercent;

  return (
    <div className={classes.background}>
      {stabilizationPercent > 0 && (
        <BackgroundSection
          width={stabilizationPercent}
          label="Stabilization"
          startEpoch={globalStart}
          colorClass={classes.backgroundColorOne}
        />
      )}
      {pruningPercent > 0 && (
        <BackgroundSection
          width={pruningPercent}
          label="Pruning"
          startEpoch={pruningStart}
          colorClass={classes.backgroundColorTwo}
        />
      )}
      {fineTuningPercent > 0 && (
        <BackgroundSection
          width={fineTuningPercent}
          label="Fine-Tuning"
          startEpoch={pruningEnd}
          colorClass={classes.backgroundColorThree}
        />
      )}
      <BackgroundDivider epoch={globalEnd} />
    </div>
  );
};

Background.propTypes = {
  pruningStart: PropTypes.number.isRequired,
  pruningEnd: PropTypes.number.isRequired,
  globalStart: PropTypes.number.isRequired,
  globalEnd: PropTypes.number.isRequired,
};

export default Background;
