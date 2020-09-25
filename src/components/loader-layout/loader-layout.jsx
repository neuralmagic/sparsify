import React from "react";
import PropTypes from "prop-types";
import { CircularProgress, Typography } from "@material-ui/core";

import makeStyles from "./loader-layout-styles";

const useStyles = makeStyles();

function LoaderLayout({
  loading,
  status,
  error,
  errorTitle,
  progress,
  loaderSize,
  rootClass,
  loaderClass,
  errorClass,
  children,
}) {
  const classes = useStyles();

  const showError = !!error;
  const showLoading =
    !showError && (loading || status === "idle" || status === "loading");
  const showLoadingIndefinite =
    showLoading && (progress === undefined || progress === null);
  const showLoadingProgress = showLoading && !showLoadingIndefinite;
  const showChildren = !showError && !showLoading;

  if (!loaderSize) {
    loaderSize = 56;
  }

  if (!errorTitle) {
    errorTitle = "";
  } else {
    errorTitle = `${errorTitle}: `;
  }

  if (!rootClass) {
    rootClass = "";
  }

  if (!loaderClass) {
    loaderClass = "";
  }

  if (!errorClass) {
    errorClass = "";
  }

  return (
    <div className={`${rootClass} ${classes.root}`}>
      {showError && (
        <div className={`${errorClass} ${classes.error}`}>
          <span>{`${errorTitle}${error}`}</span>
        </div>
      )}

      {showLoading && (
        <div className={`${loaderClass} ${classes.loader}`}>
          {showLoadingIndefinite && (
            <CircularProgress color="primary" size={loaderSize} />
          )}
          {showLoadingProgress && (
            <div className={classes.progressContainer}>
              <CircularProgress
                color="primary"
                variant="static"
                value={progress}
                size={loaderSize}
              />
              <div className={classes.progressTextContainer}>
                <Typography variant="h6" color="primary">
                  {progress ? Math.round(progress) : 0}%
                </Typography>
              </div>
            </div>
          )}
        </div>
      )}

      {showChildren && children}
    </div>
  );
}

LoaderLayout.propTypes = {
  loading: PropTypes.bool,
  status: PropTypes.string,
  error: PropTypes.string,
  errorTitle: PropTypes.string,
  progress: PropTypes.number,
  rootClass: PropTypes.string,
  loaderClass: PropTypes.string,
  errorClass: PropTypes.string,
  children: PropTypes.node,
};

export default LoaderLayout;
