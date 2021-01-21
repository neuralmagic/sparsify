import React from "react";
import PropTypes from "prop-types";

import makeStyles from "./scroller-layout-styles";
import AbsoluteLayout from "../absolute-layout";

const useStyles = makeStyles();

function ScrollerLayout({
  spacingLeft,
  spacingRight,
  spacingTop,
  spacingBottom,
  rootClass,
  layoutClass,
  children,
}) {
  const classes = useStyles();

  if (!rootClass) {
    rootClass = "";
  }

  if (!layoutClass) {
    layoutClass = "";
  }

  return (
    <AbsoluteLayout
      spacingLeft={spacingLeft}
      spacingRight={spacingRight}
      spacingBottom={spacingBottom}
      spacingTop={spacingTop}
      rootClass={rootClass}
      layoutClass={`${layoutClass} ${classes.layout}`}
    >
      {children}
    </AbsoluteLayout>
  );
}

ScrollerLayout.propTypes = {
  spacingLeft: PropTypes.number,
  spacingRight: PropTypes.number,
  spacingTop: PropTypes.number,
  spacingBottom: PropTypes.number,
  rootClass: PropTypes.string,
  layoutClass: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default ScrollerLayout;
