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
  STATUS_IDLE,
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

  const [closing, setClosing] = useState(false);
  const [name, setName] = useState("");
  const createLossProfileState = useSelector(selectCreateLossProfile);
  const profiling =
    createLossProfileState.status === STATUS_LOADING ||
    createLossProfileState.status === STATUS_FAILED;

  const canceling = createLossProfileState.cancelingStatus === STATUS_LOADING;

  const action =
    createLossProfileState.status === STATUS_SUCCEEDED ? "Completed" : "Add";

  let profilingLabel = "Profiling Loss";
  if (canceling || createLossProfileState.status === STATUS_SUCCEEDED) {
    profilingLabel = "Canceling";
  } else if (createLossProfileState.error) {
    profilingLabel = "";
  }

  const handleClear = () => {
    dispatch(clearCreateLossProfile());
    setName("");
  };

  // Will wait until canceling is finished before closing
  useEffect(() => {
    if (
      createLossProfileState.cancelingStatus === STATUS_SUCCEEDED &&
      createLossProfileState.status !== STATUS_LOADING &&
      closing
    ) {
      handleClose();
      handleClear();
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
      setClosing(true);
    } else {
      handleClose();
      handleClear();
    }
  };

  const handleAction = () => {
    const completed = createLossProfileState.status === STATUS_SUCCEEDED;
    if (!createLossProfileState.error && !profiling && !completed) {
      dispatch(
        createLossProfileThunk({
          projectId,
          name,
        })
      );
    } else if (completed) {
      history.push(`/project/${projectId}/loss/${createLossProfileState.profileId}`);

      handleClear();
      dispatch(clearCreateLossProfile());
      dispatch(
        getProfilesLossThunk({
          projectId,
        })
      );
      handleClose();
    } else if (createLossProfileState.error) {
      if (createLossProfileState.val) {
        dispatch(
          cancelAndDeleteLossProfileThunk({
            projectId,
            profileId: createLossProfileState.profileId,
          })
        );
      }
      handleClear();
    }
  };

  return (
    <Dialog
      aria-labelledby="profile-perf-create-dialog-title"
      fullWidth={true}
      maxWidth="md"
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
              <Grid className={classes.profileBody} container spacing={2}>
                <Grid item xs={4}>
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
              {createLossProfileState.error && (
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
