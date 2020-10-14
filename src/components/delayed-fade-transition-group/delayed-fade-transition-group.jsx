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
