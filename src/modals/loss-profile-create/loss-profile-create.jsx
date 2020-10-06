import React, { useState } from "react";
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
import _ from "lodash";

import {
  getProfilesLossThunk,
  STATUS_FAILED,
  STATUS_LOADING,
  STATUS_SUCCEEDED,
  createLossProfileThunk,
  clearCreateLossProfile,
  selectCreateLossProfile,
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

  const action =
    createLossProfileState.status === STATUS_SUCCEEDED ? "Completed" : "Add";

  const profilingLabel = createLossProfileState.error ? "" : "Profiling Loss";

  const handleAction = () => {
    const completed = createLossProfileState.status === STATUS_SUCCEEDED;
    if (!createLossProfileState.error && !profiling && !completed) {
      dispatch(
        createLossProfileThunk({
          projectId: projectId,
          name,
        })
      );
    } else if (completed) {
      handleClose();
      history.push(`/project/${projectId}/loss/${createLossProfileState.profileId}`);

      dispatch(clearCreateLossProfile());
      dispatch(
        getProfilesLossThunk({
          projectId,
        })
      );
    } else if (createLossProfileState.error) {
      dispatch(clearCreateLossProfile());
    }
  };

  return (
    <Dialog
      aria-labelledby="profile-perf-create-dialog-title"
      fullWidth={true}
      maxWidth="md"
      open={open}
      onClose={handleClose}
      PaperProps={{ className: classes.dialog }}
    >
      <div className={classes.root}>
        <DialogTitle>New Loss Profile</DialogTitle>
        <DialogContent>
          <FadeTransitionGroup
            className={classes.dialogContent}
            showIndex={profiling ? 1 : 0}
          >
            <div className={classes.content}>
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
            <div className={`${classes.loaderContainer} ${classes.content}`}>
              <LoaderLayout
                loading={createLossProfileState.status === STATUS_LOADING}
                progress={createLossProfileState.progressValue}
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
          <Button onClick={handleClose} className={classes.cancelButton}>
            Close
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
