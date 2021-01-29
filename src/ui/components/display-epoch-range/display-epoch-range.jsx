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
