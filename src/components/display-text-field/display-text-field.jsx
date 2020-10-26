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
