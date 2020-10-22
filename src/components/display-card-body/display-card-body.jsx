import React from "react";
import PropTypes from "prop-types";

import makeStyles from "./display-card-body-styles";

const useStyles = makeStyles();

const DisplayCardBody = ({ children, className }) => {
  const classes = useStyles();

  return <div className={`${classes.layout} ${className}`}>{children}</div>;
};

DisplayCardBody.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)])
    .isRequired,
  className: PropTypes.string,
};

export default DisplayCardBody;
