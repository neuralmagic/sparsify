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
  loaderSpacingHoriz,
  loaderSpacingVert,
  errorSpacingHoriz,
  errorSpacingVert,
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

  const useStyles = makeStyles(
    loaderSpacingHoriz,
    loaderSpacingVert,
    errorSpacingHoriz,
    errorSpacingVert
  );
  const classes = useStyles();

  if (!errorTitle) {
    errorTitle = "";
  } else {
    errorTitle = `${errorTitle}: `;
  }

  return (
    <div className={classes.root}>
      {showError && (
        <span className={classes.error}>{`${errorTitle}${error}`}</span>
      )}

      {showLoading && (
        <div className={classes.progress}>
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
  loaderSpacingHoriz: PropTypes.number,
  loaderSpacingVert: PropTypes.number,
  errorSpacingHoriz: PropTypes.number,
  errorSpacingVert: PropTypes.number,
  children: PropTypes.node.isRequired,
};

export default LoaderLayout;
