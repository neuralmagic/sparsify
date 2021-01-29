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
import Slider from "@material-ui/core/Slider";

import makeStyles from "./display-slider-styles";
import DisplayTextField from "../display-text-field";

const useStyles = makeStyles();

const DisplaySlider = ({
  value,
  min,
  max,
  step,
  displayLabel,
  displayValue,
  hideDisplay,
  marks,
  onChange,
  className,
  textFieldClassName,
  sliderClassName,
}) => {
  const classes = useStyles();

  return (
    <div className={`${classes.root} ${className}`}>
      {!hideDisplay && (
        <DisplayTextField
          className={textFieldClassName}
          label={displayLabel}
          value={displayValue}
          disabled={true}
        />
      )}
      <Slider
        classes={{
          root: `${classes.slider} ${sliderClassName}`,
          markLabel: classes.sliderMarkLabel,
          markLabelActive: classes.sliderMarkLabelActive,
        }}
        min={min}
        max={max}
        value={value}
        step={step}
        marks={marks}
        onChange={(e, value) => (onChange ? onChange(Number(value), false) : null)}
        onChangeCommitted={(e, value) =>
          onChange ? onChange(Number(value), true) : null
        }
      />
    </div>
  );
};

DisplaySlider.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  displayLabel: PropTypes.string,
  displayValue: PropTypes.string,
  hideDisplay: PropTypes.bool,
  marks: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  className: PropTypes.string,
  textFieldClassName: PropTypes.string,
  sliderClassName: PropTypes.string,
};

export default DisplaySlider;
