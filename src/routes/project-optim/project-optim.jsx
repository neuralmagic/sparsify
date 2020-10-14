import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Fab } from "@material-ui/core";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";

import _ from "lodash";

import {
  selectedOptimById,
  selectSelectedOptimsState,
  setCreateOptimModalOpen,
  selectCreatedOptimsState,
  selectSelectedProjectState,
} from "../../store";
import OptimPruning from "./optim-pruning";
import makeStyles from "./project-optim-styles";
import GenericPage from "../../components/generic-page";
import LoaderLayout from "../../components/loader-layout";
import AbsoluteLayout from "../../components/absolute-layout";
import ExportDialog from "../../modals/export-config";
import OptimCreate from "../../modals/optim-create";
import ProjectOptimRoot from "./project-optim-root";

const useStyles = makeStyles();

function ProjectOptim(props) {
  const { optimId, projectId } = props.match.params;
  const optim = useSelector(selectedOptimById(optimId));
  const dispatch = useDispatch();

  const optimsState = useSelector(selectSelectedOptimsState);
  const selectedProjectState = useSelector(selectSelectedProjectState);
  const createOptimState = useSelector(selectCreatedOptimsState);
  const selectedSelectedOptimsState = useSelector(selectSelectedOptimsState);
  const [openExportModal, setOpenExportModal] = useState(false);

  const classes = useStyles();

  let errorMessage = null;
  if (selectSelectedOptimsState.error) {
    errorMessage = selectSelectedOptimsState.error;
  } else if (selectSelectedOptimsState.status === "succeeded" && !optim) {
    errorMessage = `Optimization with id ${optimId} not found.`;
  }

  useEffect(() => {
    if (
      optimsState.status === "succeeded" &&
      createOptimState.status === "idle" &&
      optimsState.val.length === 0
    ) {
      dispatch(setCreateOptimModalOpen(true));
    }
  }, [optimsState.status, createOptimState.status, optimsState.val, dispatch]);

  if (!optimId && optimsState.status === "succeeded" && optimsState.val.length === 0) {
    return (
      <Box>
        <OptimCreate
          open={createOptimState.modalOpen || false}
          handleClose={() => dispatch(setCreateOptimModalOpen(false))}
          projectId={selectedProjectState.projectId}
        />
        <ProjectOptimRoot />
      </Box>
    );
  }

  return (
    <AbsoluteLayout>
      <LoaderLayout
        status={selectedSelectedOptimsState.status}
        loaderClass={classes.loading}
        rootClass={classes.loading}
        error={errorMessage}
        errorComponent={
          <GenericPage
            title="Error Retrieving Optimization"
            description={errorMessage}
            logoComponent={<SentimentVeryDissatisfiedIcon />}
          />
        }
      >
        {optim && <OptimPruning optim={optim}></OptimPruning>}
        <OptimCreate
          open={createOptimState.modalOpen || false}
          handleClose={() => dispatch(setCreateOptimModalOpen(false))}
          projectId={selectedProjectState.projectId || ""}
        />
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
        {optim && projectId && (
          <ExportDialog
            projectId={projectId}
            optimId={optimId}
            open={openExportModal}
            handleClose={() => setOpenExportModal(false)}
          />
        )}
      </LoaderLayout>
    </AbsoluteLayout>
  );
}

export default ProjectOptim;
