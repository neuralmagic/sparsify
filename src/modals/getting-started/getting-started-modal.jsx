import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
} from "@material-ui/core";

import makeStyles from "./getting-started-styles";

const useStyles = makeStyles();

function GettingStartedModal({ open, handleClose, userDoNotShow, setUserDoNotShow }) {
  const classes = useStyles();

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h6">Getting Started Workflow</Typography>
      </DialogTitle>

      <DialogContent className={classes.content}>
        <div className={classes.instruction}>
          <div className={classes.instructionNumber}>
            <Typography color="primary" variant="h4">
              1
            </Typography>
          </div>
          <Typography
            color="textPrimary"
            variant="h6"
            className={classes.instructionText}
          >
            Upload an{" "}
            <a target="_blank" href="https://onnx.ai/">
              ONNX
            </a>{" "}
            version of your model to a new project
          </Typography>
        </div>
        <div className={classes.instruction}>
          <div className={classes.instructionNumber}>
            <Typography color="primary" variant="h4">
              2
            </Typography>
          </div>
          <Typography
            color="textPrimary"
            variant="h6"
            className={classes.instructionText}
          >
            Profile the model for the effects of model optimizations on loss and
            performance
          </Typography>
        </div>
        <div className={classes.instruction}>
          <div className={classes.instructionNumber}>
            <Typography color="primary" variant="h4">
              3
            </Typography>
          </div>
          <Typography
            color="textPrimary"
            variant="h6"
            className={classes.instructionText}
          >
            Create an automatic model optimization config and edit as desired
          </Typography>
        </div>
        <div className={classes.instruction}>
          <div className={classes.instructionNumber}>
            <Typography color="primary" variant="h4">
              4
            </Typography>
          </div>
          <Typography
            color="textPrimary"
            variant="h6"
            className={classes.instructionText}
          >
            Export the config and integrate it into your current training flow
          </Typography>
        </div>
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <div className={classes.checkbox}>
          <FormControlLabel
            value="end"
            control={
              <Checkbox
                color="primary"
                checked={userDoNotShow}
                onChange={(e) => setUserDoNotShow(e.target.checked)}
              />
            }
            label="Don't Show Again"
            labelPlacement="end"
          />
        </div>
        <Button onClick={handleClose} className={classes.button} disableElevation>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

GettingStartedModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  userDoNotShow: PropTypes.bool.isRequired,
  setUserDoNotShow: PropTypes.func.isRequired,
};

export default GettingStartedModal;
