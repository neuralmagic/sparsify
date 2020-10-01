import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
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
  selectSystemState,
  createProjectProfilesThunk,
} from "../../store";
import DescribeProject from "./describe-project";
import ProfileProject from "./profile-project";
import {
  createProjectLossPath,
  createProjectPath,
  createProjectPerfPath,
} from "../../routes/paths";

const useStyles = makeStyles();

function ProjectCreateDialog({ open, handleClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [selectedFile, setSelectedFile] = useState(null);
  const createProjectState = useSelector(selectCreateProjectState);
  const systemInfoState = useSelector(selectSystemState);

  function updateModal(payload) {
    dispatch(updateCreateProjectModal(payload));
  }

  useEffect(() => {
    if (
      createProjectState.creationStatus === STATUS_SUCCEEDED &&
      !createProjectState.modelSelectRecognized
    ) {
      updateModal({
        modelSelectRecognized: true,
        slideIndex: 1,
      });
    }

    if (systemInfoState.val && createProjectState.profilePerfNumCores === null) {
      updateModal({
        profilePerfNumCores: `${systemInfoState.val.cores_per_socket}`,
      });
    }
  }, [createProjectState, systemInfoState, updateModal, dispatch]);

  const progressModel =
    createProjectState.creationStatus === STATUS_SUCCEEDED ||
    ["modelAnalysis", "finalize"].indexOf(createProjectState.creationProgressStage) > -1
      ? 100
      : createProjectState.creationProgressValue;
  const progressProject = createProjectState.slideIndex > 0 ? 100 : null;
  const progressProfile =
    createProjectState.slideIndex < 2
      ? null
      : createProjectState.profilingStatus === STATUS_SUCCEEDED
      ? 100
      : createProjectState.profilingProgressValue
      ? createProjectState.profilingProgressValue
      : 0;
  const instructionSets =
    systemInfoState.val && systemInfoState.val.available_instructions
      ? systemInfoState.val.available_instructions.join(" ")
      : "";
  const nmEngineAvailable =
    systemInfoState.val && systemInfoState.val.available_engines
      ? systemInfoState.val.available_engines.indexOf("neural_magic") > -1
      : false;
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
    const profilesRun = createProjectState.profilingStatus === STATUS_SUCCEEDED;
    const profilesToRun =
      createProjectState.profilePerf || createProjectState.profileLoss;
    const profilesError = !nmEngineAvailable && createProjectState.profilePerf;
    currentAction = {
      label: !profilesRun && profilesToRun ? "run" : "complete",
      enabled:
        profilesRun ||
        (!profilesError && createProjectState.profilingStatus === STATUS_IDLE),
      previous: true,
    };
  }

  function clearCurrent(del = true) {
    if (createProjectState.val && del) {
      const projectId = createProjectState.val.project_id;
      dispatch(deleteProjectThunk({ projectId }));
    }

    setSelectedFile(null);
    dispatch(clearCreateProject());
  }

  function clearCurrentProfiles() {}

  function onClose(del = true) {
    clearCurrent(del);
    handleClose();
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
    } else if (currentAction.label === "run") {
      let profilePerfBatchSize = parseFloat(createProjectState.profilePerfBatchSize);
      let profilePerfNumCores = parseFloat(createProjectState.profilePerfNumCores);

      if (isNaN(profilePerfBatchSize)) {
        profilePerfBatchSize = 1;
      }

      if (isNaN(profilePerfNumCores)) {
        profilePerfNumCores = -1;
      }

      dispatch(
        createProjectProfilesThunk({
          projectId: createProjectState.val.project_id,
          profileLoss: createProjectState.profileLoss,
          profilePerf: createProjectState.profilePerf,
          profileLossName: createProjectState.profileLossName,
          profilePerfName: createProjectState.profilePerfName,
          profilePerfBatchSize,
          profilePerfNumCores,
        })
      );
    } else if (currentAction.label === "complete") {
      let path = createProjectPath(createProjectState.val.project_id);

      if (createProjectState.profilingPerfVal) {
        path = createProjectPerfPath(
          createProjectState.val.project_id,
          createProjectState.profilingPerfVal.profile_id
        );
      } else if (createProjectState.profilingLossVal) {
        path = createProjectLossPath(
          createProjectState.val.project_id,
          createProjectState.profilingLossVal.profile_id
        );
      }

      onClose(false);
      history.push(path);
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
              selectedFile={selectedFile}
              uploading={
                createProjectState.creationStatus === STATUS_LOADING ||
                createProjectState.creationStatus === STATUS_FAILED
              }
              uploadingStage={createProjectState.creationProgressStage}
              uploadingProgress={createProjectState.creationProgressValue}
              uploadingError={createProjectState.creationError}
              disableInputs={createProjectState.creationStatus !== STATUS_IDLE}
              handleRemotePath={(value) => updateModal({ remotePath: value })}
              handleSelectedFile={(value) => setSelectedFile(value)}
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
            <ProfileProject
              profileLoss={createProjectState.profileLoss}
              profileLossName={createProjectState.profileLossName}
              profilePerf={createProjectState.profilePerf}
              profilePerfName={createProjectState.profilePerfName}
              profilePerfBatchSize={createProjectState.profilePerfBatchSize}
              profilePerfNumCores={createProjectState.profilePerfNumCores}
              instructionSets={instructionSets}
              nmEngineAvailable={nmEngineAvailable}
              profiling={
                createProjectState.profilingStatus === STATUS_LOADING ||
                createProjectState.profilingStatus === STATUS_FAILED
              }
              profilingStage={createProjectState.profilingProgressStage}
              profilingProgress={createProjectState.profilingProgressValue}
              profilingError={createProjectState.profilingError}
              disableInputs={createProjectState.profilingStatus !== STATUS_IDLE}
              handleProfileLoss={(value) => updateModal({ profileLoss: value })}
              handleProfilePerf={(value) => updateModal({ profilePerf: value })}
              handlePerfName={(value) => updateModal({ profilePerfName: value })}
              handleLossName={(value) => updateModal({ profileLossName: value })}
              handlePerfBatchSize={(value) =>
                updateModal({ profilePerfBatchSize: value })
              }
              handlePerfNumCores={(value) =>
                updateModal({ profilePerfNumCores: value })
              }
              handleClear={clearCurrentProfiles}
            />
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
};

export default ProjectCreateDialog;
