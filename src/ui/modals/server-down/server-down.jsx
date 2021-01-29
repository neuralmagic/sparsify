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

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import { selectServerState, getSystemInfoThunk } from "../../store";
import makeStyles from "./server-down-styles";

const useStyles = makeStyles();

function ServerDownModal() {
  const [serverDown, setServerDown] = useState(false);
  const dispatch = useDispatch();

  const classes = useStyles();
  const selectedServerState = useSelector(selectServerState);
  const { online, status } = selectedServerState;

  useEffect(() => {
    const updateAsync = async () => {
      if (online && serverDown) {
        window.location.reload();
        setServerDown(false);
      } else if (online === false && !serverDown) {
        setServerDown(true);
      }
      if (status === "idle") {
        dispatch(getSystemInfoThunk());
      }
    };

    updateAsync();
  }, [dispatch, online, status, serverDown]);

  return (
    <Dialog
      open={serverDown}
      disableBackdropClick
      disableEscapeKeyDown
      PaperProps={{ className: classes.dialog }}
      className={classes.root}
    >
      <DialogTitle>Sparsify Server Not Detected</DialogTitle>
      <DialogContent>
        <Typography>
          Confirm the Sparsify server is running to use. See the Sparsify User Guide for
          more detail
        </Typography>
      </DialogContent>
      <DialogActions>
        {status !== "loading" && (
          <Button
            onClick={() => dispatch(getSystemInfoThunk())}
            color="secondary"
            variant="contained"
            disableElevation
          >
            Refresh
          </Button>
        )}
        {status === "loading" && (
          <Box marginRight={3}>
            <CircularProgress size="30px" />
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ServerDownModal;
