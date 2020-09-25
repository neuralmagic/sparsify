import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import SwipeableViews from "react-swipeable-views";

import makeStyles from "./project-create-styles";
import PropTypes from "prop-types";
import ProgressHeader from "./progress-header";
import SelectModel from "./select-model";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProjectThunk,
  STATUS_IDLE,
  STATUS_LOADING,
  STATUS_SUCCEEDED,
  clearCreateProject,
  updateCreateProjectModal,
  createProjectWithModelUploadThunk,
  selectCreateProjectState,
  STATUS_FAILED,
  createProjectWithModelFromPathThunk,
  updateProjectThunk,
} from "../../store";
import DescribeProject from "./describe-project";
import ProfileProject from "./profile-project";

const useStyles = makeStyles();

function ProjectCreateDialog({ open, handleClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [selectedFile, setSelectedFile] = useState(null);
  const createProjectState = useSelector(selectCreateProjectState);

  function updateModal(payload) {
    dispatch(updateCreateProjectModal(payload));
  }

  if (
    createProjectState.creationStatus === STATUS_SUCCEEDED &&
    !createProjectState.modelSelectRecognized
  ) {
    updateModal({
      modelSelectRecognized: true,
      slideIndex: 1,
    });
  }

  let currentAction = {
    label: "next",
    id: "next",
    enabled: true,
  };

  if (createProjectState.slideIndex === 0) {
    const modelPushed = createProjectState.creationStatus === STATUS_SUCCEEDED;
    currentAction = {
      label: modelPushed ? "next" : "select",
      enabled: modelPushed,
      previous: false,
    };

    if (!modelPushed && selectedFile) {
      currentAction.label = "upload";
      currentAction.enabled = createProjectState.creationStatus === STATUS_IDLE;
    } else if (!modelPushed && createProjectState.remotePath) {
      currentAction.label = "download";
      currentAction.enabled =
        createProjectState.creationStatus === STATUS_IDLE &&
        !createProjectState.remotePathError;
    }
  } else if (createProjectState.slideIndex === 1) {
    currentAction = {
      label: "next",
      enabled: true,
      previous: true,
    };
  } else if (createProjectState.slideIndex === 2) {
    currentAction = {
      label: "run",
      enabled: true,
      previous: true,
    };
  }

  function clearCurrent() {
    if (createProjectState.val) {
      const projectId = createProjectState.val.project_id;
      dispatch(deleteProjectThunk({ projectId }));
    }

    setSelectedFile(null);
    dispatch(clearCreateProject());
  }

  function onClose() {
    clearCurrent();
    handleClose();
  }

  function handleRemotePath(value) {
    updateModal({ remotePath: value });
  }

  function handleSelectedFile(value) {
    setSelectedFile(value);
  }

  function handleAction() {
    if (currentAction.label === "upload") {
      dispatch(createProjectWithModelUploadThunk({ file: selectedFile }));
    } else if (currentAction.label === "download") {
      dispatch(
        createProjectWithModelFromPathThunk({ uri: createProjectState.remotePath })
      );
    } else if (currentAction.label === "next") {
      if (createProjectState.slideIndex === 1) {
        // push updated project name and description
        dispatch(
          updateProjectThunk({
            projectId: createProjectState.val.project_id,
            name: createProjectState.val.name,
            description: createProjectState.val.description,
            noUpdateStore: true,
          })
        );
      }

      updateModal({ slideIndex: createProjectState.slideIndex + 1 });
    } else {
      throw Error(`unknown currentAction.label ${currentAction.label}`);
    }
  }

  function handlePrevious() {
    updateModal({ slideIndex: createProjectState.slideIndex - 1 });
  }

  function handleName(value) {
    if (createProjectState.val) {
      createProjectState.val.name = value;
    }
  }

  function handleDescription(value) {
    if (createProjectState.val) {
      createProjectState.val.description = value;
    }
  }

  const progressModel =
    createProjectState.creationStatus === STATUS_SUCCEEDED ||
    ["modelAnalysis", "finalize"].indexOf(createProjectState.creationProgressStage) > -1
      ? 100
      : createProjectState.creationProgressValue;
  const progressProject =
    createProjectState.slideIndex > 1
      ? 100
      : createProjectState.slideIndex > 0
      ? 0
      : null;
  const progressProfile = createProjectState.slideIndex < 2 ? null : 0;

  return (
    <Dialog
      open={open}
      aria-labelledby="project-create-dialog-title"
      fullWidth={true}
      maxWidth="sm"
    >
      <div className={classes.root}>
        <DialogTitle id="project-create-dialog-title" onClose={handleClose}>
          New Project Setup
        </DialogTitle>
        <ProgressHeader
          progressModel={progressModel}
          progressProject={progressProject}
          progressProfile={progressProfile}
        />
        <DialogContent className={classes.content}>
          <SwipeableViews
            index={createProjectState.slideIndex}
            disabled={true}
            className={classes.swipable}
            slideClassName={classes.swipableSlide}
            containerStyle={{ width: "100%", height: "100%" }}
          >
            <SelectModel
              remotePath={createProjectState.remotePath}
              remotePathError={createProjectState.remotePathError}
              handleRemotePath={handleRemotePath}
              selectedFile={selectedFile}
              handleSelectedFile={handleSelectedFile}
              uploading={
                createProjectState.creationStatus === STATUS_LOADING ||
                createProjectState.creationStatus === STATUS_FAILED
              }
              uploadingStage={createProjectState.creationProgressStage}
              uploadingProgress={createProjectState.creationProgressValue}
              uploadingError={createProjectState.creationError}
              disableInputs={createProjectState.creationStatus !== STATUS_IDLE}
              handleClear={clearCurrent}
            />
            <DescribeProject
              name={createProjectState.val ? createProjectState.val.name : ""}
              description={
                createProjectState.val ? createProjectState.val.description : ""
              }
              handleName={handleName}
              handleDescription={handleDescription}
            />
            <ProfileProject />
          </SwipeableViews>
          <DialogActions>
            <Button onClick={onClose} className={classes.cancelButton}>
              Cancel
            </Button>
            <Button
              onClick={handlePrevious}
              className={`${classes.previousButton} ${
                !currentAction.previous ? classes.previousButtonHidden : ""
              }`}
              disabled={!currentAction.previous}
            >
              Back
            </Button>
            <Button
              onClick={handleAction}
              className={classes.deleteButton}
              color="secondary"
              disabled={!currentAction.enabled}
              variant="contained"
              disableElevation
            >
              {currentAction.label}
            </Button>
          </DialogActions>
        </DialogContent>
      </div>
    </Dialog>
  );
}

ProjectCreateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default ProjectCreateDialog;
