import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Fab } from "@material-ui/core";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

import { selectedOptimById } from "../../store";
import OptimPruning from "./optim-pruning";
import makeStyles from "./project-optim-styles";
import AbsoluteLayout from "../../components/absolute-layout";
import ExportDialog from "../../modals/export-config";

const useStyles = makeStyles();

function ProjectOptim(props) {
  const { optimId, projectId } = props.match.params;
  const optim = useSelector(selectedOptimById(optimId));
  const [openExportModal, setOpenExportModal] = useState(false);

  const classes = useStyles();

  return (
    <AbsoluteLayout>
      <OptimPruning optim={optim}></OptimPruning>
      <Fab
        variant="extended"
        color="secondary"
        aria-label="New Project"
        className={classes.fab}
        onClick={() => setOpenExportModal(true)}
      >
        <OpenInNewIcon classes={classes.fabIcon} />
        Export
      </Fab>
      <ExportDialog
        projectId={projectId}
        optimId={optimId}
        open={openExportModal}
        handleClose={() => setOpenExportModal(false)}
      />
    </AbsoluteLayout>
  );
}

export default ProjectOptim;
