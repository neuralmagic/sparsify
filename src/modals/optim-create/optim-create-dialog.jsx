import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import SwipeableViews from "react-swipeable-views";
import _ from "lodash";

import {
  selectSelectedProjectState,
  selectCreatedOptimsState,
  selectDefaultProfilesLoss,
  selectDefaultProfilesPerf,
  getOptimsThunk,
  updateProjectThunk,
  createOptimThunk,
  STATUS_LOADING,
  STATUS_FAILED,
  STATUS_SUCCEEDED,
  clearOptim,
} from "../../store";
import OptimInitContainer from "./optim-init-container";
import OptimSelectContainer from "./optim-select-container";
import makeStyles from "./optim-create-styles";
import useOptimSettingsState from "./hooks/optim-settings-hooks";
import { createProjectOptimPath } from "../../routes/paths";
import useProjectUpdateState from "../../hooks/use-project-update-state";
import FadeTransitionGroup from "../../components/fade-transition-group";
import LoaderLayout from "../../components/loader-layout";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles();

function OptimCreateDialog({ open, handleClose, projectId }) {
  const [modalView, setModalView] = useState(0);
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [abortController, setAbortController] = useState();
  const defaultPerf = useSelector(selectDefaultProfilesPerf);
  const defaultLoss = useSelector(selectDefaultProfilesLoss);
  const { pruning, setPruning, setDefault } = useOptimSettingsState();
  const {
    changeValue,
    projectLoaded,
    projectSaving,
    values,
    saveValues,
    validationErrors,
  } = useProjectUpdateState(projectId);

  const createOptimState = useSelector(selectCreatedOptimsState);
  const selectedProjectState = useSelector(selectSelectedProjectState);

  if (
    selectedProjectState.status === STATUS_SUCCEEDED &&
    selectedProjectState.val.project_id !== values.projectId
  ) {
    projectLoaded(selectedProjectState.val);
  }

  const loading =
    createOptimState.status === STATUS_LOADING ||
    createOptimState.status === STATUS_FAILED;
  const completed = createOptimState.status === STATUS_SUCCEEDED;

  let action = modalView === 1 ? "Apply" : "Next";
  let label = createOptimState.error ? "" : "Creating Optimization";
  if (completed) {
    label = "Completed";
    action = "Run";
  }

  const handleClear = () => {
    dispatch(clearOptim());
    setModalView(0);
    setDefault();
    setAbortController(undefined);
  };

  const onCancel = () => {
    if (abortController) {
      abortController.abort();
    }
    handleClose();

    handleClear();
  };

  useEffect(() => {
    if (completed && open) {
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
  }, [completed, open, defaultLoss, defaultPerf, dispatch]);

  const onSubmit = () => {
    if (completed) {
      dispatch(getOptimsThunk({ projectId }));
      handleClose();
    } else if (modalView === 1) {
      projectSaving();
      const abortController = new AbortController();
      setAbortController(abortController);
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
      dispatch(
        createOptimThunk({
          projectId,
          add_pruning: pruning,
          abortController,
        })
      );
    } else {
      setModalView(modalView + 1);
    }
  };

  const onPrevious = () => {
    if (modalView > 0) {
      setModalView(modalView - 1);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        handleClear();
        handleClose();
      }}
      PaperProps={{ className: classes.dialog }}
    >
      <DialogTitle>Model Optimization Settings</DialogTitle>
      <DialogContent>
        <SwipeableViews
          index={modalView}
          disabled={true}
          containerStyle={{ width: "100%", height: "100%" }}
        >
          <OptimInitContainer
            onCancel={() => handleClose()}
            onNext={() => setModalView(1)}
            pruning={pruning}
            setPruning={setPruning}
          />
          <FadeTransitionGroup
            showIndex={loading ? 1 : 0}
            className={classes.transitionGroup}
          >
            <OptimSelectContainer
              onCancel={() => handleClose()}
              onPrevious={() => setModalView(0)}
              optimizer={values.trainingOptimizer}
              optimizerValError={validationErrors.trainingOptimizer}
              optimizerOnChange={(e) =>
                changeValue("trainingOptimizer", e.target.value)
              }
              epochs={values.trainingEpochs}
              epochsValError={validationErrors.trainingEpochs}
              epochsOnChange={(e) => changeValue("trainingEpochs", e.target.value)}
              initLR={values.trainingLRInit}
              initLRValError={validationErrors.trainingLRInit}
              initLROnChange={(e) => changeValue("trainingLRInit", e.target.value)}
              finalLR={values.trainingLRFinal}
              finalLRValError={validationErrors.trainingLRFinal}
              finalLROnChange={(e) => changeValue("trainingLRFinal", e.target.value)}
              onSubmit={() => onSubmit()}
            />
            <Box className={classes.loaderContainer}>
              <LoaderLayout
                loading={createOptimState.status === STATUS_LOADING}
                error={createOptimState.error}
              />
              <Typography
                variant="body1"
                color="textPrimary"
                className={classes.loaderText}
              >
                {label}
              </Typography>
              {createOptimState.error && <Button onClick={handleClear}>Clear</Button>}
            </Box>
          </FadeTransitionGroup>
        </SwipeableViews>
      </DialogContent>

      <DialogActions>
        <Box paddingRight={1}>
          <Button
            onClick={() => onCancel()}
            className={`${classes.button} ${classes.cancelButton}`}
            disableElevation
          >
            Cancel
          </Button>
        </Box>
        <Box marginRight={1}>
          <Button
            onClick={() => onPrevious()}
            disabled={loading}
            className={
              modalView === 1
                ? `${classes.cancelButton} ${classes.previousButton}`
                : `${classes.cancelButton} ${classes.previousButton} ${classes.hidden}`
            }
            disableElevation
          >
            Back
          </Button>
        </Box>
        <Box>
          <Button
            onClick={() => onSubmit()}
            disabled={loading}
            color="secondary"
            variant="contained"
            className={classes.button}
            disableElevation
          >
            {action}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

OptimCreateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  projectId: PropTypes.string.isRequired,
};

export default OptimCreateDialog;
