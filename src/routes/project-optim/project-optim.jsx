import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Fab } from "@material-ui/core";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";

import { selectedOptimById, selectSelectedOptimsState } from "../../store";
import OptimPruning from "./optim-pruning";
import makeStyles from "./project-optim-styles";
import GenericPage from "../../components/generic-page";
import LoaderLayout from "../../components/loader-layout";
import AbsoluteLayout from "../../components/absolute-layout";
import ExportDialog from "../../modals/export-config";

const useStyles = makeStyles();

function ProjectOptim(props) {
  const { optimId, projectId } = props.match.params;
  const optim = useSelector(selectedOptimById(optimId));
  const selectedSelectedOptimsState = useSelector(selectSelectedOptimsState);
  const [openExportModal, setOpenExportModal] = useState(false);

  const classes = useStyles();

  let errorMessage = null;
  if (selectSelectedOptimsState.error) {
    errorMessage = selectSelectedOptimsState.error
  } else if (!optim) {
    errorMessage = `Optimization with id ${optimId} not found.`
  }
  return (
    <AbsoluteLayout>
      <LoaderLayout
        status={selectedSelectedOptimsState.status}
        error={errorMessage}
        errorComponent={<GenericPage
          title="Error Retrieving Optimization"
          description={errorMessage}
          logoComponent={<SentimentVeryDissatisfiedIcon />}
        />}
      >
        {optim && <OptimPruning optim={optim}></OptimPruning>}
        <Fab
          variant="extended"
          color="secondary"
          aria-label="New Project"
          className={classes.fab}
          onClick={() => setOpenExportModal(true)}
        >
          <OpenInNewIcon className={classes.fabIcon} />
          Export
        </Fab>
        <ExportDialog
          projectId={projectId}
          optimId={optimId}
          open={openExportModal}
          handleClose={() => setOpenExportModal(false)}
        />
      </LoaderLayout>
      
    </AbsoluteLayout>
  );
}

export default ProjectOptim;
