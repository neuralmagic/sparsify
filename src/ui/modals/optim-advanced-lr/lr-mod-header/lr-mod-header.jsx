import React from "react";
import PropTypes from "prop-types";
import { Typography, Button } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import makeStyles from "./lr-mod-header-styles";

const useStyles = makeStyles();

function LRModHeader({ addDisabled, onAdd }) {
  const classes = useStyles();

  return (
    <div className={classes.modifiersHeader}>
      <Typography
        color="textSecondary"
        variant="subtitle2"
        className={classes.lrRowItem}
      >
        LR Schedules
      </Typography>
      <Typography
        color="textSecondary"
        variant="subtitle2"
        className={classes.lrRowItem}
      >
        Active Epoch Range
      </Typography>
      <Typography color="textSecondary" variant="subtitle2">
        Options
      </Typography>
      <div className={classes.spacer} />
      <Button color="primary" onClick={onAdd} disabled={addDisabled}>
        <AddCircleOutlineIcon style={{ marginRight: "8px" }} /> Add LR Schedule
      </Button>
    </div>
  );
}

LRModHeader.propTypes = {
  addDisabled: PropTypes.bool,
  onAdd: PropTypes.func,
};

export default LRModHeader;
