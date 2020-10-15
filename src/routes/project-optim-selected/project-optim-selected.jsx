import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Fab, Typography } from "@material-ui/core";
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
import makeStyles from "./project-optim-selected-styles";
import GenericPage from "../../components/generic-page";
import LoaderLayout from "../../components/loader-layout";
import AbsoluteLayout from "../../components/absolute-layout";
import ExportDialog from "../../modals/export-config";
import OptimCreate from "../../modals/optim-create";
import TrainingSummaryCard from "./training-summary-card";
import ScrollerLayout from "../../components/scroller-layout";
import LRModifierCard from "./lr-modifier-card";

const useStyles = makeStyles();

function ProjectOptimSelected(props) {
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
  }, [optimsState.status, createOptimState.status, _.get(optimsState, "val.length")]);

  return (
    <ScrollerLayout layoutClass={classes.root}>
      <LoaderLayout
        status={selectedSelectedOptimsState.status}
        loaderClass={classes.loading}
        rootClass={classes.body}
        error={errorMessage}
        errorComponent={
          <GenericPage
            title="Error Retrieving Optimization"
            description={errorMessage}
            logoComponent={<SentimentVeryDissatisfiedIcon />}
          />
        }
      >
        {optim && (
          <div className={classes.layout}>
            <OptimPruning optim={optim}></OptimPruning>

            {optim.lr_schedule_modifiers && optim.lr_schedule_modifiers.length > 0 && (
              <div>
                <div className={classes.spacer} />

                <Typography
                  color="textSecondary"
                  variant="h5"
                  className={classes.title}
                >
                  Learning Rate Modifier
                </Typography>

                {optim.lr_schedule_modifiers.map((mod) => (
                  <LRModifierCard
                    key={mod.modifier_id}
                    modifier={mod}
                    optimId={optimId}
                    projectId={projectId}
                    globalStartEpoch={optim.start_epoch}
                    globalEndEpoch={optim.end_epoch}
                  />
                ))}
              </div>
            )}

            <div>
              <div className={classes.spacer} />
              <Typography color="textSecondary" variant="h5" className={classes.title}>
                Training Summary
              </Typography>
              <TrainingSummaryCard projectId={projectId} optim={optim} />
            </div>
            <div className={classes.spacer} />
            <div className={classes.spacer} />
          </div>
        )}

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
    </ScrollerLayout>
  );
}

export default ProjectOptimSelected;
