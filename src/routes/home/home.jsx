import React, { useState } from "react";
import { Fab, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

import makeStyles from "./home-styles";
import AbsoluteLayout from "../../components/absolute-layout";
import ProjectCreateDialog from "../../modals/project-create";
import GettingStartedDialog from "../../modals/getting-started";
import DefaultHome from "./default-home";
import { localStorageAvailable } from "../../components";
const useStyles = makeStyles();
const HOME_URL = null;

const useGettingStarted = () => {
  const userShownKey = "nmGettingStartedUserShown";
  const userDoNotShowKey = "nmGettingStartedUserDoNotShow";
  let initUserShown = false;
  let initUserDoNotShow = false;

  if (localStorageAvailable()) {
    const tmpUserShown = localStorage.getItem(userShownKey);
    const tmpUserDoNotShow = localStorage.getItem(userDoNotShowKey);

    if (tmpUserShown !== null) {
      initUserShown = true;
    } else {
      localStorage.setItem(userDoNotShowKey, "true");
    }

    if (tmpUserDoNotShow !== null) {
      initUserDoNotShow = tmpUserDoNotShow === "true";
    } else {
      localStorage.setItem(userDoNotShowKey, "true");
      initUserDoNotShow = true;
    }
  }

  const [userDoNotShow, setStateUserDoNotShow] = useState(initUserDoNotShow);
  const [open, setOpen] = useState(!initUserShown && !initUserDoNotShow);

  return {
    userDoNotShow,
    setUserDoNotShow: (val) => {
      setStateUserDoNotShow(val);

      if (localStorageAvailable()) {
        localStorage.setItem(userDoNotShowKey, val ? "true" : "false");
      }
    },
    gettingStartedOpen: open,
    setGettingStartedOpen: setOpen,
  };
};

function Home() {
  const classes = useStyles();
  const [displayType, setDisplayType] = useState(HOME_URL ? "iframe" : "fallback");
  const [createOpen, setCreateOpen] = useState(false);

  const {
    userDoNotShow,
    setUserDoNotShow,
    gettingStartedOpen,
    setGettingStartedOpen,
  } = useGettingStarted();

  return (
    <AbsoluteLayout>
      <div className={classes.info}>
        <IconButton
          size="medium"
          className={classes.infoButton}
          onClick={() => setGettingStartedOpen(true)}
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
        open={gettingStartedOpen}
        handleClose={() => setGettingStartedOpen(false)}
        userDoNotShow={userDoNotShow}
        setUserDoNotShow={setUserDoNotShow}
      />
    </AbsoluteLayout>
  );
}

export default Home;
