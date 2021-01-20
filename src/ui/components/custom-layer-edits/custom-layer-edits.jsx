import React from "react";
import { Typography, Button } from "@material-ui/core";

import makeStyles from "./custom-layer-edits-styles";

const useStyles = makeStyles();

const CustomLayerEdits = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography className={classes.text}>Custom layer edits are applied.</Typography>
      <Button className={classes.button}>Reset</Button>
    </div>
  );
};

export default CustomLayerEdits;
