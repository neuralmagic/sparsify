/*
Copyright 2021-present Neuralmagic, Inc.

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
    deepsparse: null,
    sparseml: null,
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
              <Typography>Contact support@neuralmagic.com</Typography>
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
        <Button onClick={() => handleClose()} disableElevation>
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
