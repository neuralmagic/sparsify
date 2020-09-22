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
}) {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.section}>
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
          className={classes.inputNumber}
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
};

export default ProjectSettingsContainer;
