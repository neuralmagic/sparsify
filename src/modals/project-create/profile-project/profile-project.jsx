import React from "react";
import { Button, IconButton, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import PropTypes from "prop-types";

import makeStyles from "./profile-project-styles";
import LoaderLayout from "../../../components/loader-layout";
import FadeTransitionGroup from "../../../components/fade-transition-group";

const useStyles = makeStyles();

function ProfileProject({
  profileLoss,
  profilePerf,
  profilePerfName,
  profilePerfBatchSize,
  profilePerfNumCores,
  instructionSets,
  nmEngineAvailable,
  profiling,
  profilingStage,
  profilingProgress,
  profilingError,
  disableInputs,
  handleProfileLoss,
  handleProfilePerf,
  handlePerfName,
  handlePerfBatchSize,
  handlePerfNumCores,
  handleClear,
}) {
  const classes = useStyles();

  const action = profilingError ? "Clear" : "Cancel";
  let profilingLabel = profilingError ? "" : "Profiling model";

  profilePerf = true;

  // if (uploadingStage === "projectCreate") {
  //   uploadingLabel = "Setting up";
  // } else if (uploadingStage === "modelUpload") {
  //   uploadingLabel = "Uploading";
  // } else if (uploadingStage === "modelDownload") {
  //   uploadingLabel = "Downloading";
  // } else if (uploadingStage === "modelAnalysis") {
  //   uploadingLabel = "Analyzing model";
  // } else if (uploadingStage === "finalize") {
  //   uploadingLabel = "Finalizing";
  // }

  function handleAction() {
    if (profilingError && handleClear) {
      handleClear();
    }
  }

  return (
    <div className={classes.root}>
      <FadeTransitionGroup showIndex={!profiling ? 0 : 1}>
        <div className={classes.content}>
          <Typography>
            Measure the model's baseline and effects of optimizations on
          </Typography>
          <div className={classes.profileContainer}>
            <FormControlLabel
              control={
                <Switch
                  checked={profilePerf}
                  onChange={handleProfilePerf}
                  color="primary"
                />
              }
              label="Performance"
              labelPlacement="start"
            />
            <div>
              {!profilePerf && (
                <Typography color="textSecondary" variant="subtitle2">
                  The model's inference performance will be approximated from the
                  architecture
                </Typography>
              )}
              {!nmEngineAvailable && (
                <Typography color="error" variant="subtitle2">
                  The neuralmagic package must be installed for CPU performance
                  profiling
                </Typography>
              )}
              {profilePerf && nmEngineAvailable && (
                <div>
                  <TextField
                    id="profileName"
                    variant="outlined"
                    type="text"
                    label="Profile Name"
                    value={profilePerfName}
                    disabled={disableInputs}
                    onChange={(e) => handlePerfName(e.target.value)}
                    className={classes.textField}
                  />
                  <TextField
                    id="batchSize"
                    variant="outlined"
                    type="number"
                    label="Batch Size"
                    value={profilePerfBatchSize}
                    disabled={disableInputs}
                    onChange={(e) => handlePerfBatchSize(e.target.value)}
                    className={classes.textField}
                  />
                  <TextField
                    id="numCores"
                    variant="outlined"
                    type="number"
                    label="CPU Cores"
                    value={profilePerfNumCores}
                    disabled={disableInputs}
                    onChange={(e) => handlePerfNumCores(e.target.value)}
                    className={classes.textField}
                  />
                  <TextField
                    id="instructionSets"
                    variant="outlined"
                    type="number"
                    label="Instruction Sets"
                    value={profilePerfNumCores}
                    disabled={true}
                    className={classes.textField}
                  />
                </div>
              )}
            </div>
          </div>

          <div className={classes.profileContainer}>
            <FormControlLabel
              control={
                <Switch
                  checked={profileLoss}
                  onChange={handleProfileLoss}
                  color="primary"
                />
              }
              label="Loss"
              labelPlacement="start"
            />
            {!profileLoss && (
              <Typography color="textSecondary" variant="subtitle2">
                The model's loss will be approximated from the architecture
              </Typography>
            )}
          </div>
        </div>

        <div className={`${classes.loaderContainer} ${classes.content}`}>
          <LoaderLayout
            loading={true}
            progress={profilingProgress}
            error={profilingError}
            loaderSize={96}
          />
          <Typography
            variant="body1"
            color="textPrimary"
            className={classes.loaderText}
          >
            {profilingLabel}
          </Typography>
          {profilingError && <Button onClick={handleAction}>{action}</Button>}
        </div>
      </FadeTransitionGroup>
    </div>
  );
}

ProfileProject.propTypes = {
  remotePath: PropTypes.string,
  remotePathError: PropTypes.string,
  handleRemotePath: PropTypes.func,
  selectedFile: PropTypes.object,
  handleSelectedFile: PropTypes.func,
  uploading: PropTypes.bool,
  uploadingStage: PropTypes.string,
  uploadingProgress: PropTypes.number,
  uploadingError: PropTypes.string,
  disableInputs: PropTypes.bool,
  handleClear: PropTypes.func,
};

export default ProfileProject;
