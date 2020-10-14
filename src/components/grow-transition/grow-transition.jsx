import React from "react";
import PropTypes from "prop-types";
import { Grow } from "@material-ui/core";

function GrowTransition({ show, children, onEntered }) {
  const transTime = 300;
  return (
    <Grow
      in={show}
      unmountOnExit
      timeout={transTime}
      onEntered={() => {
        if (onEntered) {
          onEntered();
        }
      }}
    >
      {children}
    </Grow>
  );
}

GrowTransition.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  onEntered: PropTypes.func,
};

export default GrowTransition;
