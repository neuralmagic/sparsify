import React, { useState } from "react";
import { Box, Fab, CircularProgress } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { ReactComponent as NMLogo } from "./img/logo.svg";
import GenericPage from "../../components/generic-page";
import makeStyles from "./home-styles";
import AbsoluteLayout from "../../components/absolute-layout";

const useStyles = makeStyles();
const HOME_URL = "https://www.neuralmagic.com";

function Home() {
  const [loadingStatus, setLoadingStatus] = useState("loading");
  const classes = useStyles();

  fetch({
    url: HOME_URL,
    mode: 'nocors',
  }).then(response => {
    setLoadingStatus("success")
  }).catch((error) => {
    setLoadingStatus("error")
  })

  return (
    <AbsoluteLayout>
      {loadingStatus === "loading" && (
        <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
          <CircularProgress/>
        </Box>
      )}
      {loadingStatus === "success" && (
        <iframe title={"Home"} width="100%" height="100%" src={HOME_URL} onError={error => console.log("failed")}>
        </iframe>
      )}
      {loadingStatus === "error" && (
        <GenericPage
          title="Sparsify"
          description="Select a project from the left or add a new project with the bottom right button to profile, benchmark, and optimize your Neural Network for production"
          logoComponent={<NMLogo/>}
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
