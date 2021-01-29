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
import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";

import makeStyles from "./display-metric-styles";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles();

function DisplayMetric({
  title,
  size,
  wrap,
  rootClass,
  titleClass,
  metricClass,
  children,
}) {
  const classes = useStyles();

  if (!size) {
    size = "medium";
  }

  let titleVariant = "subtitle2";
  let metricVariant = null;

  if (size === "small") {
    metricVariant = "h6";
  } else if (size === "medium") {
    metricVariant = "h6";
  } else if (size === "large") {
    metricVariant = "h4";
  }

  return (
    <div className={`${rootClass} ${classes.root}`}>
      <Typography
        color="textSecondary"
        className={`${titleClass} ${classes.title}`}
        variant={titleVariant}
      >
        {title}
      </Typography>
      <Tooltip title={children} classes={{ tooltip: classes.valueTooltip }}>
        <Typography
          color="textPrimary"
          className={`${metricClass} ${classes.metric} ${
            size === "small" || size === "large" ? classes.metricReduceFontWeight : ""
          }`}
          variant={metricVariant}
          noWrap={!wrap}
        >
          {children}
        </Typography>
      </Tooltip>
    </div>
  );
}

DisplayMetric.propTypes = {
  title: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  noWrap: PropTypes.bool,
  rootClass: PropTypes.string,
  titleClass: PropTypes.string,
  metricClass: PropTypes.string,
  children: PropTypes.node,
};

export default DisplayMetric;
