import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import makeStyles from "./display-card-actions-styles";

const useStyles = makeStyles();

const DisplayCardActions = ({ children, className, noMargin }) => {
  const classes = useStyles();

  return (
    <div
      className={`${classes.layout} ${className} ${!noMargin ? classes.margin : ""}`}
    >
      {children}
    </div>
  );
};

DisplayCardActions.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)])
    .isRequired,
  className: PropTypes.string,
  noMargin: PropTypes.bool,
};

export default DisplayCardActions;
