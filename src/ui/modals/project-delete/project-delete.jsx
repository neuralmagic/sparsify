/*
Copyright (c) 2021 - present / Neuralmagic, Inc. All Rights Reserved.

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

import React, { useState } from "react";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import PropTypes from "prop-types";

import makeStyles from "./project-delete-styles";
import NullableText from "../../components/nullable-text";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles();

function ProjectDeleteDialog({ open, projectName, handleClose, handleDelete }) {
  const classes = useStyles();
  const [inputConfirm, setInputConfirm] = useState("");

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      aria-labelledby="project-delete-dialog-title"
      fullWidth={true}
      width="sm"
    >
      <DialogTitle id="project-delete-dialog-title" onClose={handleClose}>
        Delete{" "}
        <NullableText placeholder="Project" value={projectName}>
          {projectName}
        </NullableText>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Typography>
          Deleting this project will remove all files, directory and history. Are you
          sure you want to continue?
        </Typography>
        <TextField
          id="confirmation"
          variant="outlined"
          type="text"
          label="Confirmation"
          error={inputConfirm !== "YES"}
          helperText="Type “YES” to confirm deletion of the project."
          value={inputConfirm}
          className={classes.textInput}
          onChange={(e) => setInputConfirm(e.target.value)}
        />
        <DialogActions>
          <Button
            onClick={handleDelete}
            disabled={inputConfirm !== "YES"}
            className={classes.deleteButton}
          >
            Delete
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

ProjectDeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  projectName: PropTypes.string,
  handleClose: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default ProjectDeleteDialog;
