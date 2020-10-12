import React, { useState } from "react";
import { Fab, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

import makeStyles from "./home-styles";
import AbsoluteLayout from "../../components/absolute-layout";
import ProjectCreateDialog from "../../modals/project-create";
import GettingStartedDialog from "../../modals/getting-started";
import DefaultHome from "./default-home";
const useStyles = makeStyles();
const HOME_URL = null;

const useGettingStarted = () => {
  if (localStorage.getItem("nmHideGettingStarted") === null) {
    localStorage.setItem("nmHideGettingStarted", false);
  }

  const _hideGettingStarted =
    localStorage.getItem("nmHideGettingStarted") === "true" ? true : false;
  const [hideGettingStarted, _setHideGettingStarted] = useState(_hideGettingStarted);
  const [gettingStarted, setGettingStarted] = useState(!hideGettingStarted);
  return {
    gettingStarted,
    setGettingStarted,
    setHideGettingStarted: (hide) => {
      _setHideGettingStarted(hide);
      localStorage.setItem("nmHideGettingStarted", hide);
    },
    hideGettingStarted,
  };
};

function Home() {
  const classes = useStyles();
  const [displayType, setDisplayType] = useState(HOME_URL ? "iframe" : "fallback");
  const [createOpen, setCreateOpen] = useState(false);

  const {
    gettingStarted,
    setGettingStarted,
    hideGettingStarted,
    setHideGettingStarted,
  } = useGettingStarted();

  return (
    <AbsoluteLayout>
      <div className={classes.info}>
        <IconButton
          size="medium"
          className={classes.infoButton}
          onClick={() => setGettingStarted(true)}
        >
          <HelpOutlineIcon />
        </IconButton>
      </div>
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
      <GettingStartedDialog
        setHideGettingStarted={setHideGettingStarted}
        open={gettingStarted}
        handleClose={() => setGettingStarted(false)}
        hideGettingStarted={hideGettingStarted}
      />
    </AbsoluteLayout>
  );
}

export default Home;
