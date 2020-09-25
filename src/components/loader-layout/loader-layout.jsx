import React from "react";
import PropTypes from "prop-types";
import { CircularProgress } from "@material-ui/core";

import makeStyles from "./loader-layout-styles";

const useStyles = makeStyles();

function LoaderLayout({
  loading,
  status,
  error,
  errorTitle,
  errorComponent,
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
  const showLoadingIndefinite = showLoading && progress === undefined;
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
      {showError && !errorComponent && (
        <div className={`${errorClass} ${classes.error}`}>
          <span>{`${errorTitle}${error}`}</span>
        </div>
      )}
      {showError && errorComponent}

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
  errorComponent: PropTypes.node,
  errorTitle: PropTypes.string,
  progress: PropTypes.number,
  rootClass: PropTypes.string,
  loaderClass: PropTypes.string,
  errorClass: PropTypes.string,
  children: PropTypes.node,
};

export default LoaderLayout;
