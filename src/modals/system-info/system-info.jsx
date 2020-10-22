import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Divider,
  Link,
  Switch,
  Typography,
  Grid,
} from "@material-ui/core";
import Brightness2Icon from "@material-ui/icons/Brightness2";
import Brightness5Icon from "@material-ui/icons/Brightness5";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";

import { selectSystemState, getSystemInfoThunk } from "../../store";
import makeStyles from "./system-info-styles";
import { ReactComponent as NMLogo } from "./img/logo.svg";

const useStyles = makeStyles();

function SystemInfoField({ label, value }) {
  return (
    <Grid container alignItems="flex-start">
      <Grid item xs={6}>
        <Typography color="textSecondary">{label}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>{value ? `${value}` : "Not Detected"}</Typography>
      </Grid>
    </Grid>
  );
}

function SystemInfoModal({ open, handleClose, isDarkMode, toggleDarkMode }) {
  const selectedSystemState = useSelector(selectSystemState);
  const dispatch = useDispatch();
  const classes = useStyles();

  const version_info = _.get(selectedSystemState, "val.version_info", {
    neuralmagic: null,
    neuralmagicML: null,
    onnx: null,
    onnxruntime: null,
  });

  const available_instructions = _.get(
    selectedSystemState,
    "val.available_instructions"
  );

  useEffect(() => {
    if (open) {
      dispatch(getSystemInfoThunk());
    }
  }, [open, dispatch]);

  return (
    <Dialog
      PaperProps={{ className: classes.dialog }}
      open={open}
      onClose={() => handleClose()}
      maxWidth="md"
    >
      <DialogContent>
        <Box textAlign="left">
          <Box className={classes.block} textAlign="center">
            <Box display="flex" justifyContent="center" alignItems="center">
              <Box className={classes.logo}>
                <NMLogo />
              </Box>
              <Typography className={classes.title}>Sparsify</Typography>
            </Box>
            <Typography variant="subtitle2">{`v${process.env.REACT_APP_VERSION}`}</Typography>
          </Box>

          <Divider />

          <Box className={classes.block}>
            {Object.entries(version_info).map(([key, value]) => {
              return <SystemInfoField value={value} key={key} label={key} />;
            })}
            <SystemInfoField
              label={"instruction sets"}
              value={
                available_instructions
                  ? available_instructions.join(", ")
                  : available_instructions
              }
            />
          </Box>

          <Divider />

          <Box className={classes.block}>
            <Link className={classes.link} href="mailto:support@neuralmagic.com">
              <Typography>Contact Support</Typography>
            </Link>
          </Box>

          <Box className={classes.block} display="none">
            {isDarkMode && <Brightness2Icon />}
            {!isDarkMode && <Brightness5Icon />}
            <Switch
              size="small"
              checked={isDarkMode}
              onClick={() => toggleDarkMode()}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => handleClose()}
          disableElevation
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SystemInfoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
};

export default SystemInfoModal;
