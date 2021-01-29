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
import { TextField } from "@material-ui/core";
import PropTypes from "prop-types";

import makeStyles from "./display-text-field-styles";

const useStyles = makeStyles();

function DisplayTextField({
  label,
  value,
  disabled,
  className,
  onValueChange,
  onFinished,
}) {
  const classes = useStyles();

  return (
    <TextField
      variant="outlined"
      type="text"
      label={label}
      value={value}
      disabled={disabled}
      onChange={(e) => (onValueChange ? onValueChange(e.target.value) : null)}
      onKeyDown={(e) => e.keyCode === 13 && onFinished && onFinished()}
      onBlur={onFinished}
      className={`${classes.textField} ${className}`}
    />
  );
}

DisplayTextField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onValueChange: PropTypes.func,
  onFinished: PropTypes.func,
};

export default DisplayTextField;
