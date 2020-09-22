import React, { useState } from "react";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { ReactComponent as NMLogo } from "./img/logo.svg";
import GenericPage from "../../components/generic-page";
import makeStyles from "./home-styles";
import AbsoluteLayout from "../../components/absolute-layout";

const useStyles = makeStyles();
const HOME_URL = null;

function Home() {
  const classes = useStyles();
  const [displayType, setDisplayType] = useState(HOME_URL ? "iframe" : "fallback");

  const fallbackDescription =
    "Select a project from the left or add a new project with the bottom right button to profile, " +
    "benchmark, and optimize your Neural Network for production.";

  return (
    <AbsoluteLayout>
      {displayType === "iframe" && (
        <iframe
          title={"Home"}
          width="100%"
          height="100%"
          src={HOME_URL}
          onError={() => setDisplayType("fallback")}
        />
      )}
      {displayType === "fallback" && (
        <GenericPage
          title="Sparsify"
          description={fallbackDescription}
          logoComponent={<NMLogo />}
        />
      )}

      <Fab
        variant="extended"
        color="secondary"
        aria-label="New Project"
        className={classes.fab}
      >
        <AddIcon className={classes.fabIcon} />
        New Project
      </Fab>
    </AbsoluteLayout>
  );
}

export default Home;
