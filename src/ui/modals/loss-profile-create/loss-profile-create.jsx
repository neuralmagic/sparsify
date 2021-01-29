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

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Typography,
} from "@material-ui/core";

import {
  getProfilesLossThunk,
  STATUS_FAILED,
  STATUS_LOADING,
  STATUS_SUCCEEDED,
  createLossProfileThunk,
  clearCreateLossProfile,
  selectCreateLossProfile,
  cancelAndDeleteLossProfileThunk,
} from "../../store";

import makeStyles from "./loss-profile-create-styles";
import LoaderLayout from "../../components/loader-layout";
import FadeTransitionGroup from "../../components/fade-transition-group";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles();

function LossProfileCreateDialog({ open, handleClose, projectId }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const [name, setName] = useState("");
  const createLossProfileState = useSelector(selectCreateLossProfile);
  const profiling =
    createLossProfileState.status === STATUS_LOADING ||
    createLossProfileState.status === STATUS_FAILED;

  const canceling = createLossProfileState.cancelingStatus === STATUS_LOADING;
  const completed = createLossProfileState.status === STATUS_SUCCEEDED;
  const action = createLossProfileState.status === STATUS_SUCCEEDED ? "Run" : "Add";

  let profilingLabel = "Profiling Loss";
  if (canceling || createLossProfileState.cancelingStatus === STATUS_SUCCEEDED) {
    profilingLabel = "Canceling";
  } else if (createLossProfileState.error) {
    profilingLabel = "";
  }

  const handleClear = () => {
    dispatch(clearCreateLossProfile());
    setName("");
  };

  const handleComplete = () => {
    history.push(`/project/${projectId}/loss/${createLossProfileState.profileId}`);
    handleClose();
    dispatch(
      getProfilesLossThunk({
        projectId,
      })
    );
    handleClear();
  };

  // Will wait until canceling is finished before closing
  useEffect(() => {
    if (completed && !canceling) {
      handleComplete();
    } else if (createLossProfileState.cancelingStatus === STATUS_SUCCEEDED) {
      handleClear();
      handleClose();
    }
  }, [createLossProfileState]);

  const handleCancel = () => {
    if (createLossProfileState.val) {
      dispatch(
        cancelAndDeleteLossProfileThunk({
          projectId,
          profileId: createLossProfileState.profileId,
        })
      );
    } else {
      handleClose();
      handleClear();
    }
  };

  const handleAction = () => {
    if (!createLossProfileState.error && !profiling && !completed) {
      dispatch(
        createLossProfileThunk({
          projectId,
          name,
        })
      );
    } else if (createLossProfileState.error && !canceling) {
      if (createLossProfileState.val) {
        dispatch(
          cancelAndDeleteLossProfileThunk({
            projectId,
            profileId: createLossProfileState.profileId,
          })
        );
      }
      handleClear();
    } else if (completed) {
      handleComplete();
    }
  };

  return (
    <Dialog
      aria-labelledby="profile-perf-create-dialog-title"
      fullWidth={true}
      maxWidth="sm"
      open={open}
      PaperProps={{ className: classes.dialog }}
    >
      <div className={classes.root}>
        <DialogTitle>New Loss Profile</DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <FadeTransitionGroup
            className={classes.transitionGroup}
            showIndex={profiling || canceling ? 1 : 0}
          >
            <div>
              <Typography>Measure the model's loss</Typography>
              <Grid className={classes.profileBody} container spacing={3}>
                <Grid item xs={8} direction="column">
                  <TextField
                    id="name"
                    variant="outlined"
                    type="text"
                    fullWidth
                    label="Loss Profile Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
              </Grid>
            </div>
            <div className={classes.loaderContainer}>
              <LoaderLayout
                loading={createLossProfileState.status === STATUS_LOADING || canceling}
                progress={!canceling ? createLossProfileState.progressValue : null}
                error={createLossProfileState.error}
              />
              <Typography
                variant="body1"
                color="textPrimary"
                className={classes.loaderText}
              >
                {profilingLabel}
              </Typography>
              {createLossProfileState.error &&
                createLossProfileState.cancelingStatus !== STATUS_SUCCEEDED && (
                  <Button onClick={handleAction}>Clear</Button>
                )}
            </div>
          </FadeTransitionGroup>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancel}
            className={classes.cancelButton}
            disabled={canceling}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAction}
            color="secondary"
            variant="contained"
            disableElevation
            disabled={profiling}
          >
            {action}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}

LossProfileCreateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  projectId: PropTypes.string.isRequired,
};

export default LossProfileCreateDialog;
