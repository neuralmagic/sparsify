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

import makeStyles from "./modifier-row-styles";

const useStyles = makeStyles();

const ModifierRow = ({ name, start, end, globalStart, globalEnd }) => {
  const classes = useStyles();

  if (end < 0) {
    end = globalEnd;
  }

  if (start < 0) {
    start = globalStart;
  }

  const percentTotal = (end - start) / (globalEnd - globalStart);
  const percentBeforeStart = start / (globalEnd - globalStart);

  return (
    <div className={classes.modifier}>
      <div className={classes.modifierLabelContainer}>
        <div className={classes.modifierLabelWrapper}>
          <Typography
            className={classes.modifierLabel}
            color="textPrimary"
            variant="subtitle2"
            noWrap
          >
            {name}
          </Typography>
        </div>
      </div>

      <div className={classes.modifierBackground}>
        <div
          className={classes.modifierActive}
          style={{
            width: `${percentTotal * 100}%`,
            marginLeft: `${percentBeforeStart * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

ModifierRow.propTypes = {
  name: PropTypes.string.isRequired,
  start: PropTypes.number,
  end: PropTypes.number,
  globalStart: PropTypes.number,
  globalEnd: PropTypes.number,
};

export default ModifierRow;
