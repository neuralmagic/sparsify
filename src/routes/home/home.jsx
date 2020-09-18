import React from "react";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import makeStyles from "./home-styles";
import AbsoluteLayout from "../../components/absolute-layout";

function Home() {
  const useStyles = makeStyles();
  const classes = useStyles();

  return (
    <AbsoluteLayout>
      <Fab
        variant="extended"
        color="secondary"
        aria-label="New Project"
        className={classes.fab}
      >
        <AddIcon />
        New Project
      </Fab>
    </AbsoluteLayout>
  );
}

export default Home;
