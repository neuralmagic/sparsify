import React, { useCallback, useState } from "react";
import { Button, IconButton, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";

import makeStyles from "./select-model-styles";
import ScrollerLayout from "../../../components/scroller-layout";
import LoaderLayout from "../../../components/loader-layout";
import FadeTransitionGroup from "../../../components/fade-transition-group";

const useStyles = makeStyles();

function SelectModel({
  remotePath,
  remotePathError,
  handleRemotePath,
  selectedFile,
  handleSelectedFile,
  uploading,
  uploadingStage,
  uploadingProgress,
  uploadingError,
  disableInputs,
  handleClear,
}) {
  const classes = useStyles();
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        handleSelectedFile(acceptedFiles[0]);
      }
    },
    [handleSelectedFile]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  function remotePathChange(newVal) {
    handleRemotePath(newVal);
  }

  function clearFileState() {
    handleRemotePath("");
    handleSelectedFile(null);
  }

  function handleAction() {
    if (uploadingError && handleClear) {
      handleClear();
    }
  }

  if (uploadingError) {
    uploadingError = `Error: ${uploadingError}`;
  }

  const action = uploadingError ? "Clear" : "Cancel";
  let uploadingLabel = uploadingError ? "" : "Selecting model";

  if (uploadingStage === "projectCreate") {
    uploadingLabel = "Setting up";
  } else if (uploadingStage === "modelUpload") {
    uploadingLabel = "Uploading";
  } else if (uploadingStage === "modelDownload") {
    uploadingLabel = "Downloading";
  } else if (uploadingStage === "modelAnalysis") {
    uploadingLabel = "Analyzing model";
  } else if (uploadingStage === "finalize") {
    uploadingLabel = "Finalizing";
  }

  return (
    <div className={classes.root}>
      <FadeTransitionGroup showIndex={!uploading ? 0 : 1}>
        <div className={classes.content}>
          <Typography>Select an ONNX model for the project</Typography>
          <div className={classes.selectFileContainer}>
            <div
              className={`${classes.selectFileUpload} ${classes.selectFileBase} ${
                selectedFile ? classes.selectFileSelected : ""
              } ${remotePath ? classes.selectFileUnselected : ""}`}
              onClick={(e) => e.stopPropagation()}
              {...(!disableInputs ? getRootProps() : {})}
            >
              <Typography
                variant="body1"
                color={selectedFile ? "textPrimary" : "textSecondary"}
                noWrap
                className={
                  selectedFile
                    ? classes.selectFileUploadTextSelected
                    : classes.selectFileUploadText
                }
              >
                {selectedFile ? selectedFile.name : "Click to browse or drag file here"}
              </Typography>
              {!disableInputs ? <input {...getInputProps()} /> : ""}
            </div>
            <Typography
              variant="body1"
              color="textPrimary"
              className={`${classes.selectFileOr} ${
                remotePath || selectedFile ? classes.selectFileUnselected : ""
              }`}
            >
              or
            </Typography>
            <TextField
              id="remotePath"
              variant="outlined"
              type="text"
              label="Remote path or URL"
              value={remotePath}
              error={!!remotePathError}
              helperText={remotePathError}
              disabled={disableInputs}
              onChange={(e) => remotePathChange(e.target.value)}
              className={`${classes.selectFileRemote} ${classes.selectFileBase} ${
                remotePath ? classes.selectFileSelected : ""
              } ${selectedFile ? classes.selectFileUnselected : ""}`}
            />
            {!disableInputs && (
              <IconButton
                className={`${classes.selectFileClear} ${
                  remotePath || selectedFile ? "" : classes.selectFileUnselected
                }`}
                onClick={clearFileState}
              >
                <CloseIcon />
              </IconButton>
            )}
          </div>
        </div>

        <div className={`${classes.loaderContainer} ${classes.content}`}>
          <LoaderLayout
            loading={true}
            progress={uploadingProgress}
            error={uploadingError}
            loaderSize={96}
          />
          <Typography
            variant="body1"
            color="textPrimary"
            className={classes.loaderText}
          >
            {uploadingLabel}
          </Typography>
          {uploadingError && <Button onClick={handleAction}>{action}</Button>}
        </div>
      </FadeTransitionGroup>
    </div>
  );
}

SelectModel.propTypes = {
  remotePath: PropTypes.string,
  remotePathError: PropTypes.string,
  handleRemotePath: PropTypes.func,
  selectedFile: PropTypes.object,
  handleSelectedFile: PropTypes.func,
  uploading: PropTypes.bool,
  uploadingStage: PropTypes.string,
  uploadingProgress: PropTypes.number,
  uploadingError: PropTypes.string,
  disableInputs: PropTypes.bool,
  handleClear: PropTypes.func,
};

export default SelectModel;
