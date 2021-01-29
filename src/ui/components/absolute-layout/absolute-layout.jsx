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

import makeStyles from "./absolute-layout-styles";

const useStyles = makeStyles();

function AbsoluteLayout({
  spacingLeft,
  spacingRight,
  spacingTop,
  spacingBottom,
  rootClass,
  layoutClass,
  children,
}) {
  const classes = useStyles({ spacingLeft, spacingRight, spacingTop, spacingBottom });

  if (!rootClass) {
    rootClass = "";
  }

  if (!layoutClass) {
    layoutClass = "";
  }

  return (
    <div className={`${rootClass} ${classes.root}`}>
      <div className={`${layoutClass} ${classes.layout}`}>{children}</div>
    </div>
  );
}

AbsoluteLayout.propTypes = {
  spacingLeft: PropTypes.number,
  spacingRight: PropTypes.number,
  spacingTop: PropTypes.number,
  spacingBottom: PropTypes.number,
  rootClass: PropTypes.string,
  layoutClass: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default AbsoluteLayout;
