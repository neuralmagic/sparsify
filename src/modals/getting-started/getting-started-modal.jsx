import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  FormControlLabel,
} from "@material-ui/core";
import ProgressHeader from "./progress-header";

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

  const action = view < 3 ? "Next" : "Finish";

  const onClose = () => {
    handleClose();
    setTimeout(() => setView(0), 500);
  };

  const onAction = () => {
    if (view < 3) {
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
        <ProgressHeader progress={view} />
      </div>
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
