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
import { Typography, Button } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import makeStyles from "./lr-mod-header-styles";

const useStyles = makeStyles();

function LRModHeader({ addDisabled, onAdd }) {
  const classes = useStyles();

  return (
    <div className={classes.modifiersHeader}>
      <Typography
        color="textSecondary"
        variant="subtitle2"
        className={classes.lrRowItem}
      >
        LR Schedules
      </Typography>
      <Typography
        color="textSecondary"
        variant="subtitle2"
        className={classes.lrRowItem}
      >
        Active Epoch Range
      </Typography>
      <Typography color="textSecondary" variant="subtitle2">
        Options
      </Typography>
      <div className={classes.spacer} />
      <Button color="primary" onClick={onAdd} disabled={addDisabled}>
        <AddCircleOutlineIcon style={{ marginRight: "8px" }} /> Add LR Schedule
      </Button>
    </div>
  );
}

LRModHeader.propTypes = {
  addDisabled: PropTypes.bool,
  onAdd: PropTypes.func,
};

export default LRModHeader;
