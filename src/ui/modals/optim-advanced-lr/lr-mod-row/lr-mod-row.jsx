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
import { IconButton, TextField, MenuItem } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import { lrModsTypes } from "../../../components";

import makeStyles from "./lr-mod-row-styles";
import useLRModState from "../hooks/use-lr-mod-state";

const useStyles = makeStyles();

function LRModRow({ lrModIndex, lrMod, onSave, onDelete }) {
  const classes = useStyles();
  const {
    changeValue,
    clearChanged,
    saveChanged,
    values,
    saveValues,
    saveOptions,
  } = useLRModState(lrMod);
  const options = [];

  if (values.clazz === "step") {
    options.push({
      key: "step_size",
      label: "Step Size",
    });
  }

  if (values.clazz === "multi_step") {
    options.push({
      key: "milestones",
      label: "Step Milestones",
    });
  }

  if (
    values.clazz === "step" ||
    values.clazz === "multi_step" ||
    values.clazz === "exponential"
  ) {
    options.push({
      key: "gamma",
      label: "Gamma",
    });
  }

  function handleSave() {
    saveChanged();

    if (onSave) {
      onSave(saveValues, lrModIndex);
    }
  }

  function handleClear() {
    clearChanged();
  }

  function handleDelete() {
    if (onDelete) {
      onDelete(lrModIndex);
    }
  }

  return (
    <div className={classes.lrModRow}>
      <div className={`${classes.lrRowItem} ${classes.lrModType}`}>
        <TextField
          select
          className={classes.lrModTypeSelector}
          value={values.clazz}
          onChange={(e) => changeValue("clazz", e.target.value)}
        >
          {lrModsTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div className={classes.lrRowItem}>
        <TextField
          type="text"
          label="Start"
          className={classes.lrModEpoch}
          value={values.start_epoch}
          onChange={(e) => changeValue("start_epoch", e.target.value)}
        />
        {values.clazz !== "set" && (
          <TextField
            type="text"
            label="End"
            className={classes.lrModEpoch}
            value={values.end_epoch}
            onChange={(e) => changeValue("end_epoch", e.target.value)}
          />
        )}
      </div>

      <div className={classes.lrModOptions}>
        <TextField
          type="text"
          label="Initial LR"
          className={classes.lrModOption}
          value={values.init_lr}
          onChange={(e) => changeValue("init_lr", e.target.value)}
        />

        {options.map((option) => (
          <TextField
            key={option.key}
            type="text"
            label={option.label}
            className={classes.lrModOption}
            value={values.args[option.key]}
            onChange={(e) => changeValue(option.key, e.target.value)}
          />
        ))}
      </div>

      <div className={classes.lrModButtons}>
        {(saveOptions.dirty || lrModIndex === "add") && (
          <IconButton
            className={classes.actionButton}
            onClick={() => handleSave()}
            size="small"
          >
            <SaveIcon />
          </IconButton>
        )}
        {saveOptions.dirty && lrModIndex !== "add" && (
          <IconButton
            className={classes.actionButton}
            onClick={() => handleClear()}
            size="small"
          >
            <HighlightOffIcon />
          </IconButton>
        )}
        <IconButton
          className={classes.actionButton}
          onClick={handleDelete}
          size="small"
        >
          <DeleteOutlineIcon />
        </IconButton>
      </div>
    </div>
  );
}

LRModRow.propTypes = {
  lrModIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  lrMod: PropTypes.object.isRequired,
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
};

export default LRModRow;
