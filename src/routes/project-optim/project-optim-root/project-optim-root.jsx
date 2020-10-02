import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import { Box, Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import {
  selectSelectedOptimsState,
  selectCreatedOptimsState,
  setCreateOptimModalOpen,
  selectSelectedProjectState,
} from "../../../store";
import { ReactComponent as Icon } from "./img/icon.svg";
import GenericPage from "../../../components/generic-page";

import makeStyles from "./project-optim-root-styles";

const useStyles = makeStyles();

function ProjectOptimRoot({ match }) {
  const optimsState = useSelector(selectSelectedOptimsState);
  const createOptimState = useSelector(selectCreatedOptimsState);
  const dispatch = useDispatch();

  const classes = useStyles();

  // useEffect(() => {
  //   if (optimsState.status === "succeeded" && createOptimState.status === "idle" && optimsState.val.length === 0) {
  //     dispatch(setCreateOptimModalOpen(true));
  //   }
  // }, [optimsState.status, createOptimState.status, _.get(optimsState,"val.length")]);

  return (
    <Box>
      <GenericPage
        logoComponent={<Icon />}
        title="Optimization"
        description="Optimize, retrain, and utilize Neural Magic's runtime engine to achieve faster inference timings."
      />
      <Fab
        variant="extended"
        color="secondary"
        aria-label="New Project"
        className={classes.fab}
        onClick={() => dispatch(setCreateOptimModalOpen(true))}
      >
        <AddIcon className={classes.fabIcon} />
        Create
      </Fab>
    </Box>
  );
}

export default ProjectOptimRoot;
