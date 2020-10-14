import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Fab } from "@material-ui/core";

import {
  selectCreatedOptimsState,
  selectSelectedProjectState,
  setCreateOptimModalOpen,
} from "../../store";
import makeStyles from "./project-optim-styles";
import GenericPage from "../../components/generic-page";
import AbsoluteLayout from "../../components/absolute-layout";
import { ReactComponent as Icon } from "./img/icon.svg";
import AddIcon from "@material-ui/icons/Add";
import OptimCreateDialog from "../../modals/optim-create/optim-create-dialog";

const useStyles = makeStyles();

function ProjectOptim() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const selectedProjectState = useSelector(selectSelectedProjectState);
  const createOptimState = useSelector(selectCreatedOptimsState);

  return (
    <AbsoluteLayout>
      <GenericPage
        logoComponent={<Icon />}
        title="Optimization"
        description="Optimize, retrain, and utilize Neural Magic to achieve smaller models and faster inference."
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
      <OptimCreateDialog
        open={createOptimState.modalOpen || false}
        handleClose={() => dispatch(setCreateOptimModalOpen(false))}
        projectId={selectedProjectState.projectId}
      />
    </AbsoluteLayout>
  );
}

export default ProjectOptim;
