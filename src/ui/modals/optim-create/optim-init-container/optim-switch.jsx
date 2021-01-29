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
import { Box, Switch, Typography } from "@material-ui/core";

import makeStyles from "../optim-create-styles";

const useStyles = makeStyles();

function OptimSwitch({ disabled, value, onChange, title, description }) {
  const classes = useStyles();

  return (
    <Box paddingY={1}>
      <Box display="flex" alignItems="top">
        <Box>
          <Switch
            disabled={disabled}
            color="primary"
            checked={value}
            onChange={() => onChange(!value)}
          />
        </Box>
        <Box paddingTop={1}>
          <Typography className={disabled ? classes.disabledText : ""}>
            {title}
          </Typography>
          <Typography
            color="textSecondary"
            className={disabled ? classes.disabledText : ""}
          >
            {description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

OptimSwitch.defaultProps = {
  disabled: false,
  value: false,
  onChange: () => {},
  title: "",
  description: "",
};

OptimSwitch.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.bool,
  onClick: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default OptimSwitch;
