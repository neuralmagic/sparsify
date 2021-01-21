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
