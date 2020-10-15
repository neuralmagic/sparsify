import React, {useState} from "react";
import { useSelector } from "react-redux";
import { Fab } from "@material-ui/core";

import {
  selectSelectedProjectState,
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
  const [modalOpen, setModalOpen] = useState(true);

  const selectedProjectState = useSelector(selectSelectedProjectState);

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
        onClick={() => setModalOpen(true)}
      >
        <AddIcon className={classes.fabIcon} />
        Create
      </Fab>
      <OptimCreateDialog
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        projectId={selectedProjectState.projectId}
      />
    </AbsoluteLayout>
  );
}

export default ProjectOptim;
