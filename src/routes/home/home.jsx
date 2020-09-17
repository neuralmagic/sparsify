import React from "react";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import makeStyles from "./home-styles";

function Home() {
  const useStyles = makeStyles();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.layout}>
        <Fab
          variant="extended"
          color="secondary"
          aria-label="New Project"
          className={classes.fab}
        >
          <AddIcon />
          New Project
        </Fab>
      </div>
    </div>
  );
}

export default Home;
