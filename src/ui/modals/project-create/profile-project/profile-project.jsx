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

import React from "react";
import { Button, Divider, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import PropTypes from "prop-types";

import makeStyles from "./profile-project-styles";
import LoaderLayout from "../../../components/loader-layout";
import FadeTransitionGroup from "../../../components/fade-transition-group";

const useStyles = makeStyles();

function ProfileSettings({
  title,
  enabled,
  error,
  disabledText,
  errorText,
  children,
  blockChanges,
  handleEnabledChanged,
}) {
  const classes = useStyles();

  return (
    <div className={classes.profileSettingsRoot}>
      <div className={classes.profileSettingsTitle}>
        <FormControlLabel
          control={
            <Switch
              checked={enabled}
              onChange={(e) => handleEnabledChanged(e.target.checked)}
              color="primary"
              disabled={blockChanges}
            />
          }
          label={title}
          labelPlacement="start"
          className={classes.profileSettingsLabel}
        />
      </div>
      <Divider className={classes.profileSettingsDivider} />
      <div className={classes.profileSettingsContainer}>
        {enabled && error && (
          <Typography
            variant="subtitle2"
            color="error"
            className={classes.profileSettingsText}
          >
            {errorText}
          </Typography>
        )}
        {enabled && !error && children}
        {!enabled && (
          <Typography
            variant="subtitle2"
            color="textSecondary"
            className={classes.profileSettingsText}
          >
            {disabledText}
          </Typography>
        )}
      </div>
    </div>
  );
}

function ProfileProject({
  profileLoss,
  profileLossName,
  profilePerf,
  profilePerfName,
  profilePerfBatchSize,
  profilePerfNumCores,
  instructionSets,
  deepsparseEngineAvailable,
  profiling,
  profilingStage,
  profilingProgress,
  profilingError,
  disableInputs,
  handleProfileLoss,
  handleLossName,
  handleProfilePerf,
  handlePerfName,
  handlePerfBatchSize,
  handlePerfNumCores,
  handleClear,
  cancelProfiling,
  canceledProfiling,
}) {
  const classes = useStyles();

  const action = profilingError ? "Clear" : "Cancel";
  let profilingLabel = profilingError ? "" : "Profiling model";

  if (
    profilingStage === "profileLossCreate" ||
    profilingStage === "profileLossProgress"
  ) {
    profilingLabel = "Profiling Loss";
  } else if (
    profilingStage === "profilePerfCreate" ||
    profilingStage === "profilePerfProgress"
  ) {
    profilingLabel = "Profiling Performance";
  }

  if (cancelProfiling || canceledProfiling) {
    profilingLabel = "Canceling";
  }

  function handleAction() {
    if (profilingError && handleClear) {
      handleClear();
    }
  }

  return (
    <div className={classes.root}>
      <FadeTransitionGroup showIndex={profiling || cancelProfiling ? 1 : 0}>
        <div className={classes.content}>
          <Typography>Measure the baseline and optimized model's:</Typography>
          <div className={classes.profilesLayout}>
            <ProfileSettings
              title="Performance"
              enabled={profilePerf}
              error={!deepsparseEngineAvailable}
              disabledText="The model's inference performance will be approximated from the architecture"
              errorText="The deepsparse package must be installed for CPU performance profiling"
              blockChanges={disableInputs}
              handleEnabledChanged={handleProfilePerf}
            >
              <div className={classes.textRow}>
                <TextField
                  id="profilePerfName"
                  variant="outlined"
                  type="text"
                  label="Performance Profile Name"
                  value={profilePerfName}
                  disabled={disableInputs}
                  onChange={(e) => handlePerfName(e.target.value)}
                  className={classes.textField}
                />
              </div>

              <div className={classes.textRow}>
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
                <div className={classes.textSpacer} />
                <TextField
                  id="numCores"
                  variant="outlined"
                  type="number"
                  label="CPU Cores"
                  value={profilePerfNumCores !== null ? profilePerfNumCores : ""}
                  disabled={disableInputs}
                  onChange={(e) => handlePerfNumCores(e.target.value)}
                  className={classes.textField}
                />
              </div>
            </ProfileSettings>

            <div className={classes.profilesSpacer} />

            <ProfileSettings
              title="Loss"
              enabled={profileLoss}
              disabledText="The model's loss will be approximated from the architecture"
              blockChanges={disableInputs}
              handleEnabledChanged={handleProfileLoss}
            >
              <div className={classes.textRow}>
                <TextField
                  id="profileLossName"
                  variant="outlined"
                  type="text"
                  label="Loss Profile Name"
                  value={profileLossName}
                  disabled={disableInputs}
                  onChange={(e) => handleLossName(e.target.value)}
                  className={classes.textField}
                />
              </div>
            </ProfileSettings>
          </div>
        </div>

        <div className={`${classes.loaderContainer} ${classes.content}`}>
          <LoaderLayout
            loading={profiling || cancelProfiling}
            progress={cancelProfiling ? null : profilingProgress}
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
          {profilingError && !cancelProfiling && (
            <Button disabled={cancelProfiling} onClick={handleAction}>
              {action}
            </Button>
          )}
        </div>
      </FadeTransitionGroup>
    </div>
  );
}

ProfileProject.propTypes = {
  profileLoss: PropTypes.bool,
  profilePerf: PropTypes.bool,
  profilePerfName: PropTypes.string,
  profilePerfBatchSize: PropTypes.string,
  profilePerfNumCores: PropTypes.string,
  instructionSets: PropTypes.string,
  deepsparseEngineAvailable: PropTypes.bool,
  profiling: PropTypes.bool,
  profilingStage: PropTypes.string,
  profilingProgress: PropTypes.number,
  profilingError: PropTypes.string,
  disableInputs: PropTypes.bool,
  handleProfileLoss: PropTypes.func,
  handleLossName: PropTypes.func,
  handleProfilePerf: PropTypes.func,
  handlePerfName: PropTypes.func,
  handlePerfBatchSize: PropTypes.func,
  handlePerfNumCores: PropTypes.func,
  handleClear: PropTypes.func,
  cancelProfiling: PropTypes.bool,
  canceledProfiling: PropTypes.bool,
};

export default ProfileProject;
