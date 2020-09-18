import React from "react";
import PropTypes from "prop-types";
import { CircularProgress } from "@material-ui/core";

import makeStyles from "./loader-layout-styles";

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
  const showError = !!error;
  const showLoading =
    !showError && (loading || status === "idle" || status === "loading");
  const showLoadingIndefinite = showLoading && progress === undefined;
  const showLoadingProgress = showLoading && !showLoadingIndefinite;
  const showChildren = !showError && !showLoading;

  if (!loaderSize) {
    loaderSize = 56;
  }

  const useStyles = makeStyles();
  const classes = useStyles();

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
            <CircularProgress
              color="primary"
              variant="static"
              value={progress}
              size={loaderSize}
            />
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
  children: PropTypes.node.isRequired,
};

export default LoaderLayout;
