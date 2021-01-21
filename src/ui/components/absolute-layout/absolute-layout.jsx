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
