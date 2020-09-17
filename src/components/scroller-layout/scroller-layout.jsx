import React from "react";
import PropTypes from "prop-types";

import makeStyles from "./scroller-layout-styles";

function ScrollerLayout({ spacingHoriz, spacingVert, children }) {
  if (!spacingHoriz) {
    spacingHoriz = 0;
  }

  if (!spacingVert) {
    spacingVert = 0;
  }

  const useStyles = makeStyles(spacingHoriz, spacingVert);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.layout}>{children}</div>
    </div>
  );
}

ScrollerLayout.propTypes = {
  spacingHoriz: PropTypes.number,
  spacingVert: PropTypes.number,
  children: PropTypes.element.isRequired,
};

export default ScrollerLayout;
