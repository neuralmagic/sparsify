import React from "react";
import { useDispatch } from "react-redux";
import _ from "lodash";

import { Box, Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import {
  setCreateOptimModalOpen,
} from "../../../store";
import { ReactComponent as Icon } from "./img/icon.svg";
import GenericPage from "../../../components/generic-page";

import makeStyles from "./project-optim-root-styles";

const useStyles = makeStyles();

function ProjectOptimRoot() {
  const dispatch = useDispatch();

  const classes = useStyles();

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
