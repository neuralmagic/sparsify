import React, { useState } from "react";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import makeStyles from "./home-styles";
import AbsoluteLayout from "../../components/absolute-layout";
import ProjectCreateDialog from "../../modals/project-create";
import DefaultHome from "./default-home";
const useStyles = makeStyles();
const HOME_URL = null;

function Home() {
  const classes = useStyles();
  const [displayType, setDisplayType] = useState(HOME_URL ? "iframe" : "fallback");
  const [createOpen, setCreateOpen] = useState(false);

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
      {displayType === "fallback" && <DefaultHome />}

      <Fab
        variant="extended"
        color="secondary"
        aria-label="New Project"
        className={classes.fab}
        onClick={() => setCreateOpen(true)}
      >
        <AddIcon className={classes.fabIcon} />
        New Project
      </Fab>
      <ProjectCreateDialog open={createOpen} handleClose={() => setCreateOpen(false)} />
    </AbsoluteLayout>
  );
}

export default Home;
