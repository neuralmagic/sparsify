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

import makeStyles from "./project-settings-container-styles";
import { trainingOptimizers } from "../utils";
import { Typography, TextField, MenuItem } from "@material-ui/core";

const useStyles = makeStyles();

function ProjectSettingsContainer({
  optimizer,
  optimizerValError,
  optimizerOnChange,
  epochs,
  epochsValError,
  epochsOnChange,
  initLR,
  initLRValError,
  initLROnChange,
  finalLR,
  finalLRValError,
  finalLROnChange,
  marginTop = true,
}) {
  const classes = useStyles();
  return (
    <div>
      <div className={marginTop ? classes.section : ""}>
        <Typography color="textPrimary" className={classes.title}>
          What optimizer was used for training?
        </Typography>
        <TextField
          id="optimizer"
          variant="outlined"
          select
          label="Training Optimizer"
          value={optimizer}
          error={!!optimizerValError}
          helperText={optimizerValError}
          onChange={optimizerOnChange}
          className={classes.inputSelect}
        >
          {trainingOptimizers.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <div className={classes.section}>
        <Typography color="textPrimary" className={classes.title}>
          How many epochs were used for training?
        </Typography>
        <TextField
          id="epochs"
          variant="outlined"
          type="text"
          label="Training Epochs"
          value={epochs}
          error={!!epochsValError}
          helperText={epochsValError}
          onChange={epochsOnChange}
        />
      </div>
      <div className={classes.section}>
        <Typography color="textPrimary" className={classes.title}>
          What learning rate range was used for training?
        </Typography>
        <div>
          <TextField
            id="initialLR"
            variant="outlined"
            type="text"
            step={0.0001}
            label="Initial LR"
            value={initLR}
            error={!!initLRValError}
            helperText={initLRValError}
            onChange={initLROnChange}
            className={classes.inputNumber}
          />
          <TextField
            id="finalLR"
            variant="outlined"
            type="text"
            step={0.0001}
            label="Final LR"
            value={finalLR}
            error={!!finalLRValError}
            helperText={finalLRValError}
            onChange={finalLROnChange}
            className={classes.inputNumber}
          />
        </div>
      </div>
    </div>
  );
}

ProjectSettingsContainer.propTypes = {
  optimizer: PropTypes.string,
  optimizerValError: PropTypes.string,
  optimizerOnChange: PropTypes.func,
  epochs: PropTypes.string,
  epochsValError: PropTypes.string,
  epochsOnChange: PropTypes.func,
  initLR: PropTypes.string,
  initLRValError: PropTypes.string,
  initLROnChange: PropTypes.func,
  finalLR: PropTypes.string,
  finalLRValError: PropTypes.string,
  finalLROnChange: PropTypes.func,
  marginTop: PropTypes.bool,
};

export default ProjectSettingsContainer;
