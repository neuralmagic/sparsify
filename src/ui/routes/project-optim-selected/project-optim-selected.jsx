/*
Copyright (c) 2021 - present / Neuralmagic, Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Fab, Typography } from "@material-ui/core";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import OptimVersionDialog from "../../modals/optim-version-create";

import {
  selectModalsState,
  selectSelectedOptim,
  selectSelectedOptimsState,
  selectSelectedProjectModelAnalysis,
  selectSelectedProjectState,
  setOptimVersionModalOpen,
  STATUS_SUCCEEDED,
} from "../../store";
import makeStyles from "./project-optim-selected-styles";
import GenericPage from "../../components/generic-page";
import LoaderLayout from "../../components/loader-layout";
import ExportDialog from "../../modals/export-config";
import TrainingSummaryCard from "./training-summary-card";
import ScrollerLayout from "../../components/scroller-layout";
import LRModifierCard from "./lr-modifier-card";
import PruningModifierCard from "./pruning-modifier-card";

const useStyles = makeStyles();

function ProjectOptimSelected(props) {
  const { optimId, projectId } = props.match.params;
  const optim = useSelector(selectSelectedOptim);

  const selectedProjectState = useSelector(selectSelectedProjectState);
  const selectedModelAnalysis = useSelector(selectSelectedProjectModelAnalysis);
  const selectedOptimsState = useSelector(selectSelectedOptimsState);
  const [openExportModal, setOpenExportModal] = useState(false);
  const modalsState = useSelector(selectModalsState);
  const classes = useStyles();
  const dispatch = useDispatch();

  let errorMessage = null;
  if (selectSelectedOptimsState.error) {
    errorMessage = selectSelectedOptimsState.error;
  } else if (selectSelectedOptimsState.status === "succeeded" && !optim) {
    errorMessage = `Optimization with id ${optimId} not found.`;
  }

  return (
    <ScrollerLayout layoutClass={classes.root}>
      <LoaderLayout
        status={selectedOptimsState.status}
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
        {optim && selectedProjectState.status === STATUS_SUCCEEDED && (
          <div className={classes.layout}>
            {optim.pruning_modifiers && optim.pruning_modifiers.length > 0 && (
              <div>
                <Typography
                  color="textSecondary"
                  variant="h5"
                  className={classes.title}
                >
                  Pruning Modifier
                </Typography>

                {optim.pruning_modifiers.map((mod) => (
                  <PruningModifierCard
                    key={mod.modifier_id}
                    modifier={mod}
                    optim={optim}
                    modelAnalysis={selectedModelAnalysis}
                  />
                ))}
              </div>
            )}

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
      <OptimVersionDialog
        optimId={optimId}
        projectId={projectId}
        open={modalsState.optimVersionModalOpen || false}
        handleClose={() => dispatch(setOptimVersionModalOpen(false))}
      />
    </ScrollerLayout>
  );
}

export default ProjectOptimSelected;
