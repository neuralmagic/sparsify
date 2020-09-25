import React from "react";
import PropTypes from "prop-types";

import { TransitionGroup } from "react-transition-group";
import FadeTransition from "../fade-transition";

function FadeTransitionGroup({ showIndex, children, className }) {
  return (
    <TransitionGroup className={className}>
      {React.Children.map(children, (child, index) => (
        <FadeTransition key={index} show={showIndex === index}>
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
