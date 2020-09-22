import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Box, Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { selectSelectedOptimsState } from "../../store";
import { ReactComponent as Icon } from "./img/icon.svg";
import OptimCreate from "../../modals/optim-create";
import GenericPage from "../../components/generic-page";

import makeStyles from "./project-optim-root-styles";

const useStyles = makeStyles();

function ProjectOptimRoot({ match }) {
  const optimsState = useSelector(selectSelectedOptimsState);
  const [isOptimCreateOpen, setIsOptimCreateOpen] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    if (optimsState.status === "succeeded" && optimsState.val.length === 0) {
      setIsOptimCreateOpen(true);
    }
  }, [optimsState]);

  return (
    <Box>
      <GenericPage
        logoComponent={<Icon />}
        title="Optimization"
        description="Optimize, retrain, and utilize Neural Magic's runtime engine to achieve faster inference timings."
      />
      <OptimCreate
        open={isOptimCreateOpen}
        handleClose={() => setIsOptimCreateOpen(false)}
        projectId={match.params.projectId}
      />
      <Fab
        variant="extended"
        color="secondary"
        aria-label="New Project"
        className={classes.fab}
        onClick={() => setIsOptimCreateOpen(true)}
      >
        <AddIcon classes={classes.fabIcon} />
        Create
      </Fab>
    </Box>
  );
}

export default ProjectOptimRoot;
