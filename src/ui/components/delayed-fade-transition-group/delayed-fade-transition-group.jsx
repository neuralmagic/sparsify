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

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { TransitionGroup } from "react-transition-group";
import FadeTransition from "../fade-transition";

import makeStyles from "./delayed-fade-transition-group-styles";

const useStyles = makeStyles();

function FadeTransitionGroup({ showIndex, children, className }) {
  const [hide, setHide] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    setHide(true);
    let timeout = setTimeout(() => {
      setHide(false);
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [showIndex]);
  return (
    <TransitionGroup
      className={className}
      style={{
        overflow: hide ? "hidden" : "inherit",
      }}
    >
      {React.Children.map(children, (child, index) => (
        <FadeTransition
          key={index}
          show={showIndex === index}
          className={showIndex !== index ? classes.hiddenChild : ""}
        >
          {child}
        </FadeTransition>
      ))}
    </TransitionGroup>
  );
}

FadeTransitionGroup.propTypes = {
  showIndex: PropTypes.number.isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  className: PropTypes.string,
};

export default FadeTransitionGroup;
