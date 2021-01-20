import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import {
  selectCreatedOptimsState,
  getOptimsThunk,
  createOptimVersionThunk,
  STATUS_LOADING,
  STATUS_FAILED,
  STATUS_SUCCEEDED,
  selectDefaultProfilesPerf,
  selectDefaultProfilesLoss,
} from "../../store";
import FadeTransitionGroup from "../../components/fade-transition-group";
import makeStyles from "./optim-version-create-styles";
import LoaderLayout from "../../components/loader-layout";
import { useHistory } from "react-router-dom";
import { createProjectOptimPath } from "../../routes/paths";

const useStyles = makeStyles();

function OptimVersionCreate({ open, handleClose, projectId, optimId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const defaultPerf = useSelector(selectDefaultProfilesPerf);
  const defaultLoss = useSelector(selectDefaultProfilesLoss);
  const createOptimState = useSelector(selectCreatedOptimsState);
  const history = useHistory();

  const loading =
    createOptimState.status === STATUS_LOADING ||
    createOptimState.status === STATUS_FAILED;
  const label = createOptimState.error ? "" : "Creating Optimization";
  const action = "Add";

  useEffect(() => {
    if (createOptimState.status === STATUS_SUCCEEDED && open) {
      history.push(
        createProjectOptimPath(
          projectId,
          createOptimState.val.optim_id,
          _.get(defaultPerf, "profile_id"),
          _.get(defaultLoss, "profile_id")
        )
      );
      dispatch(getOptimsThunk({ projectId }));
      handleClose();
      handleClear();
    }
  }, [createOptimState.status, open]);

  const handleClear = () => {
    setName("");
    setNotes("");
  };

  const onSubmit = () => {
    dispatch(
      createOptimVersionThunk({
        projectId,
        optimId,
        name,
        notes,
      })
    );
  };

  const handleCancel = () => {
    handleClear();
    handleClose();
  };

  return (
    <Dialog open={open} fullWidth={true} PaperProps={{ className: classes.dialog }}>
      <div className={classes.root}>
        <DialogTitle>Create Optimization</DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <FadeTransitionGroup
            showIndex={loading ? 1 : 0}
            className={classes.transitionGroup}
          >
            <div>
              <Grid container spacing={3} direction="column">
                <Grid item xs={8}>
                  <TextField
                    variant="outlined"
                    type="text"
                    fullWidth
                    id="name"
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    type="text"
                    fullWidth
                    multiline
                    rows={3}
                    id="notes"
                    label="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Grid>
              </Grid>
            </div>
            <div className={classes.loaderContainer}>
              <LoaderLayout
                loading={createOptimState.status === STATUS_LOADING}
                error={createOptimState.error}
              >
                <Typography
                  variant="body1"
                  color="textPrimary"
                  className={classes.loaderText}
                >
                  {label}
                </Typography>
              </LoaderLayout>
            </div>
          </FadeTransitionGroup>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancel}
            className={classes.cancelButton}
            // disabled={canceling}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit()}
            disabled={loading}
            color="secondary"
            variant="contained"
            disableElevation
          >
            {action}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}

OptimVersionCreate.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  projectId: PropTypes.string.isRequired,
};

export default OptimVersionCreate;
