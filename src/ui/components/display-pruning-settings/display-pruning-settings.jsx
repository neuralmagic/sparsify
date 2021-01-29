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
import Typography from "@material-ui/core/Typography";
import TuneIcon from "@material-ui/icons/Tune";
import Popover from "@material-ui/core/Popover";

import makeStyles from "./display-pruning-settings-styles";
import { formattedNumber } from "../utils";
import { IconButton } from "@material-ui/core";
import DisplaySlider from "../display-slider";

const useStyles = makeStyles();

const DisplayPruningSettings = ({
  sparsity,
  perfRecoveryBalance,
  filterSparsity,
  filterPerf,
  filterRecovery,
  onSparsityChange,
  onPerfRecoveryBalanceChange,
  onFilterSparsityChange,
  onFilterPerfChange,
  onFilterRecoveryChange,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const settingsOpen = Boolean(anchorEl);
  const settingsId = settingsOpen ? "pruning-settings" : undefined;

  return (
    <div className={classes.root}>
      <Typography color="textSecondary" variant="subtitle2" className={classes.label}>
        Pruning Settings
      </Typography>

      <div className={classes.sparsityContainer}>
        <DisplaySlider
          value={sparsity}
          max={1.0}
          min={0.0}
          step={0.01}
          displayLabel="Sparsity"
          displayValue={formattedNumber(sparsity ? sparsity * 100 : sparsity, 0, "%")}
          className={classes.slider}
          onChange={onSparsityChange}
        />
        <IconButton
          size="small"
          className={classes.settingsButton}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <TuneIcon />
        </IconButton>
      </div>

      <Popover
        id={settingsId}
        open={settingsOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className={classes.popoverRoot}>
          <Typography color="textPrimary" variant="body1">
            Pruning Settings
          </Typography>
          <DisplaySlider
            value={sparsity}
            max={1.0}
            min={0.0}
            step={0.01}
            displayLabel="Sparsity"
            displayValue={formattedNumber(sparsity ? sparsity * 100 : sparsity, 0, "%")}
            className={classes.popoverSlider}
            textFieldClassName={classes.popoverSliderTextField}
            onChange={onSparsityChange}
          />
          <Typography
            color="textSecondary"
            variant="subtitle2"
            className={classes.popoverLabel}
          >
            Filter Layers
          </Typography>
          <DisplaySlider
            value={filterSparsity}
            max={1.0}
            min={0.0}
            step={0.01}
            displayLabel="Min Sparsity"
            displayValue={formattedNumber(
              filterSparsity ? filterSparsity * 100 : filterSparsity,
              0,
              "%"
            )}
            className={classes.popoverSlider}
            textFieldClassName={classes.popoverSliderTextField}
            onChange={onFilterSparsityChange}
          />
          <DisplaySlider
            value={filterPerf}
            max={1.0}
            min={0.0}
            step={0.01}
            displayLabel="Min Speedup"
            displayValue={formattedNumber(filterPerf, 2, "x")}
            className={classes.popoverSlider}
            textFieldClassName={classes.popoverSliderTextField}
            onChange={onFilterPerfChange}
          />
          <DisplaySlider
            value={filterRecovery}
            max={1.0}
            min={-1.0}
            step={0.01}
            displayLabel="Min Recovery"
            displayValue={formattedNumber(filterRecovery, 2)}
            className={classes.popoverSlider}
            textFieldClassName={classes.popoverSliderTextField}
            onChange={onFilterRecoveryChange}
          />

          <Typography
            color="textSecondary"
            variant="subtitle2"
            className={classes.popoverLabel}
          >
            Optimize Sparsity For
          </Typography>
          <DisplaySlider
            value={perfRecoveryBalance}
            max={1.0}
            min={0.0}
            step={0.01}
            hideDisplay={true}
            marks={[
              { value: 0, label: "Performance" },
              { value: 1, label: "Recovery" },
            ]}
            className={`${classes.popoverSlider} ${classes.popoverSliderMarks}`}
            onChange={onPerfRecoveryBalanceChange}
          />
        </div>
      </Popover>
    </div>
  );
};

DisplayPruningSettings.propTypes = {};

export default DisplayPruningSettings;
