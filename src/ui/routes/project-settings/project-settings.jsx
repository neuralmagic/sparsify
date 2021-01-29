/*
Copyright 2021-present Neuralmagic, Inc.

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

import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Fab, Typography } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

import ScrollerLayout from "../../components/scroller-layout";
import ProjectSettingsCard from "./project-settings-card";
import makeStyles from "./project-settings-styles";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProjectThunk,
  selectSelectedProjectState,
  updateProjectThunk,
} from "../../store";
import ProjectSettingsTrainingCard from "./settings-training-card";
import ProjectSettingsDeleteCard from "./delete-card";
import useProjectUpdateState from "../../hooks/use-project-update-state";
import FadeTransition from "../../components/fade-transition";
import ProjectDeleteDialog from "../../modals/project-delete";
import { createHomePath } from "../paths";
import moment from "moment";

const useStyles = makeStyles();

function ProjectSettings({ match }) {
  const projectId = match.params.projectId;

  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    changeValue,
    projectLoaded,
    projectSaving,
    values,
    saveValues,
    validationErrors,
    saveOptions,
  } = useProjectUpdateState(projectId);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const selectedProjectState = useSelector(selectSelectedProjectState);

  const projectCreated = selectedProjectState.val
    ? moment(selectedProjectState.val.created).format("MM/DD/YYYY h:mma")
    : null;
  const projectModified = selectedProjectState.val
    ? moment(selectedProjectState.val.modified).format("MM/DD/YYYY h:mma")
    : null;
  const projectSize = selectedProjectState.val
    ? selectedProjectState.val.dir_size
    : null;
  const projectPath = selectedProjectState.val
    ? selectedProjectState.val.dir_path
    : null;
  const projectFileName =
    selectedProjectState.val && selectedProjectState.val.model
      ? selectedProjectState.val.model.file
      : null;

  if (
    selectedProjectState.status === "succeeded" &&
    selectedProjectState.val &&
    selectedProjectState.val.project_id !== values.projectId
  ) {
    projectLoaded(selectedProjectState.val);
  }

  useEffect(() => {
    if (selectedProjectState.val) {
      projectLoaded(selectedProjectState.val);
    }
  }, [selectedProjectState.val]);

  function onSaveClick() {
    projectSaving();
    dispatch(
      updateProjectThunk({
        projectId,
        name: saveValues.name,
        description: saveValues.description,
        trainingOptimizer: saveValues.trainingOptimizer,
        trainingEpochs: saveValues.trainingEpochs,
        trainingLRInit: saveValues.trainingLRInit,
        trainingLRFinal: saveValues.trainingLRFinal,
      })
    );
  }

  function onDeleteClick() {
    setDeleteModalOpen(true);
  }

  function handleDelete() {
    dispatch(deleteProjectThunk({ projectId }));
  }

  if (selectedProjectState.deleted) {
    return <Redirect to={createHomePath()} />;
  }

  return (
    <ScrollerLayout layoutClass={classes.root}>
      <div className={classes.body}>
        <div className={classes.layout}>
          <Typography color="textSecondary" variant="h5" className={classes.title}>
            Project Settings
          </Typography>
          <ProjectSettingsCard
            projectName={values.name}
            projectNameValError={validationErrors.projectName}
            projectNameOnChange={(e) => changeValue("name", e.target.value)}
            projectDesc={values.description}
            projectDescValError={validationErrors.description}
            projectDescOnChange={(e) => changeValue("description", e.target.value)}
            projectCreated={projectCreated}
            projectModified={projectModified}
            projectSize={projectSize}
            projectPath={projectPath}
            projectFilename={projectFileName}
          />
          <div className={classes.spacer} />

          <Typography color="textSecondary" variant="h5" className={classes.title}>
            Original Training Settings
          </Typography>
          <ProjectSettingsTrainingCard
            optimizer={values.trainingOptimizer}
            optimizerValError={validationErrors.trainingOptimizer}
            optimizerOnChange={(e) => changeValue("trainingOptimizer", e.target.value)}
            epochs={values.trainingEpochs}
            epochsValError={validationErrors.trainingEpochs}
            epochsOnChange={(e) => changeValue("trainingEpochs", e.target.value)}
            initLR={values.trainingLRInit}
            initLRValError={validationErrors.trainingLRInit}
            initLROnChange={(e) => changeValue("trainingLRInit", e.target.value)}
            finalLR={values.trainingLRFinal}
            finalLRValError={validationErrors.trainingLRFinal}
            finalLROnChange={(e) => changeValue("trainingLRFinal", e.target.value)}
          />
          <div className={classes.spacer} />

          <Typography color="textSecondary" variant="h5" className={classes.title}>
            Delete Project
          </Typography>
          <ProjectSettingsDeleteCard onDeleteClick={onDeleteClick} />
          <div className={classes.spacer} />
        </div>
      </div>

      <FadeTransition show={saveOptions.dirty}>
        <Fab
          variant="extended"
          color="secondary"
          aria-label="New Project"
          className={classes.fab}
          disabled={saveOptions.errored}
          onClick={onSaveClick}
        >
          <SaveIcon className={classes.fabIcon} />
          Save
        </Fab>
      </FadeTransition>

      <ProjectDeleteDialog
        open={deleteModalOpen}
        projectName={selectedProjectState.val ? selectedProjectState.val.name : ""}
        handleClose={() => setDeleteModalOpen(false)}
        handleDelete={handleDelete}
      />
    </ScrollerLayout>
  );
}

export default ProjectSettings;
