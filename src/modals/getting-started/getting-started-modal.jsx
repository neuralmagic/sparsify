import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from "@material-ui/core";
import ProgressHeader from "./progress-header";
import SwipeableViews from "react-swipeable-views";

import makeStyles from "./getting-started-styles";

const useStyles = makeStyles();

function GettingStartedModal({
  open,
  handleClose,
  setHideGettingStarted,
  hideGettingStarted,
}) {
  const classes = useStyles();
  const [view, setView] = useState(0);

  const action = view < 4 ? "Next" : "Finish";
  const headers = [
    "Getting Started",
    "Upload your model",
    "Profile your model - loss and performance",
    "Creating a model optimization configuration",
    "Exporting and integrating config into your training flow",
  ];

  const onClose = () => {
    handleClose();
    setTimeout(() => setView(0), 500);
  };

  const onAction = () => {
    if (view < 4) {
      setView(view + 1);
    } else {
      onClose();
    }
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth="sm"
      open={open}
      PaperProps={{ className: classes.root }}
      onClose={onClose}
    >
      <div className={classes.dialog}>
        <div className={classes.progress}>
          <ProgressHeader progress={view} />
        </div>
        <div className={classes.dialogContent}>
          <DialogTitle>{`${headers[view]}`}</DialogTitle>
          <DialogContent>
            <SwipeableViews disabled={true} index={view}>
              <div>Welcome</div>
              <div>Upload your model</div>
              <div>Profile your model - loss and performance</div>
              <div>Creating a model optimization configuration</div>
              <div>Exporting and integrating config into your training flow</div>
            </SwipeableViews>
          </DialogContent>
          <DialogActions>
            <div className={classes.checkbox}>
              <FormControlLabel
                value="end"
                control={
                  <Checkbox
                    color="primary"
                    checked={hideGettingStarted}
                    onChange={() => setHideGettingStarted(!hideGettingStarted)}
                  />
                }
                label="Don't Show Again"
                labelPlacement="end"
              />
            </div>
            <Button onClick={onClose} className={classes.button} disableElevation>
              Close
            </Button>
            <Button
              className={
                view === 0 ? `${classes.button} ${classes.hidden}` : classes.button
              }
              onClick={() => setView(view - 1)}
              disableElevation
            >
              Previous
            </Button>
            <Button
              className={classes.button}
              onClick={onAction}
              disableElevation
              color="secondary"
              variant="contained"
            >
              {action}
            </Button>
          </DialogActions>
        </div>
      </div>
    </Dialog>
  );
}

GettingStartedModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  setHideGettingStarted: PropTypes.func.isRequired,
  hideGettingStarted: PropTypes.bool.isRequired,
};

export default GettingStartedModal;
