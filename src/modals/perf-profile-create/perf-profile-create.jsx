import React, { useEffect, useState } from "react";
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
  InputLabel,
} from "@material-ui/core";
import _ from "lodash";

import {
  selectSystemState,
  getSystemInfoThunk,
  getProfilesPerfThunk,
  STATUS_FAILED,
  STATUS_IDLE,
  STATUS_LOADING,
  STATUS_SUCCEEDED,
  createProjectProfilesThunk,
  clearCreatePerfProfile,
  createPerfProfileThunk,
  selectCreatePerfProfileSlice,
} from "../../store";
import makeStyles from "./perf-profile-create-styles";
import LoaderLayout from "../../components/loader-layout";
import FadeTransitionGroup from "../../components/fade-transition-group";

const useStyles = makeStyles();

function PerfProfileCreateDialog({ open, handleClose, projectId }) {
  const selectedSystemState = useSelector(selectSystemState);
  const dispatch = useDispatch();
  const classes = useStyles();

  const [name, setName] = useState("");
  const [batchSize, setBatchSize] = useState(1);
  const [numCores, setNumCores] = useState(1);

  const createPerfProfileState = useSelector(selectCreatePerfProfileSlice);
  const profiling =
    createPerfProfileState.status === STATUS_LOADING ||
    createPerfProfileState.status === STATUS_FAILED;

  const action =
    createPerfProfileState.status === STATUS_SUCCEEDED ? "Completed" : "Add";

  const profilingLabel = createPerfProfileState.error ? "" : "Profiling Performance";

  const available_instructions = _.get(
    selectedSystemState,
    "val.available_instructions"
  );

  const handleAction = () => {
    const completed = createPerfProfileState.status === STATUS_SUCCEEDED;
    if (!createPerfProfileState.error && !profiling && !completed) {
      dispatch(
        createPerfProfileThunk({
          projectId: projectId,
          name,
          batchSize,
          numCores,
        })
      );
    } else if (completed) {
      handleClose();
      dispatch(clearCreatePerfProfile());
      dispatch(
        getProfilesPerfThunk({
          projectId,
        })
      );
    } else if (createPerfProfileState.error) {
      dispatch(clearCreatePerfProfile());
    }
  };

  useEffect(() => {
    if (open) {
      dispatch(getSystemInfoThunk());
    }
  }, [open, dispatch]);

  return (
    <Dialog
      aria-labelledby="project-create-dialog-title"
      fullWidth={true}
      maxWidth="md"
      open={open}
      onClose={handleClose}
      PaperProps={{ className: classes.dialog }}
    >
      <div className={classes.root}>
        <DialogTitle>New Performance Profile</DialogTitle>
        <DialogContent>
          <FadeTransitionGroup
            className={classes.dialogContent}
            showIndex={profiling ? 1 : 0}
          >
            <div className={classes.content}>
              <Typography>Measure the model's performace</Typography>
              <Grid className={classes.profileBody} container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    id="name"
                    variant="outlined"
                    type="text"
                    fullWidth
                    label="Performance Profile Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    id="batchSize"
                    variant="outlined"
                    type="number"
                    label="Batch Size"
                    value={batchSize}
                    onChange={(e) => setBatchSize(e.target.value)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    id="numCores"
                    variant="outlined"
                    type="number"
                    label="CPU Cores"
                    value={numCores !== null ? numCores : ""}
                    onChange={(e) => setNumCores(e.target.value)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <InputLabel className={classes.textLabel}>
                    Instruction Sets
                  </InputLabel>

                  <Typography>
                    {available_instructions
                      ? available_instructions.join(", ")
                      : available_instructions}
                  </Typography>
                </Grid>
              </Grid>
            </div>

            <div className={`${classes.loaderContainer} ${classes.content}`}>
              <LoaderLayout
                loading={createPerfProfileState.status === STATUS_LOADING}
                progress={createPerfProfileState.progressValue}
                error={createPerfProfileState.error}
              />
              <Typography
                variant="body1"
                color="textPrimary"
                className={classes.loaderText}
              >
                {profilingLabel}
              </Typography>
              {createPerfProfileState.error && (
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

PerfProfileCreateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
};

export default PerfProfileCreateDialog;
