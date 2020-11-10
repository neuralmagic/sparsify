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
  errorComponent,
  progress,
  loaderSize,
  rootClass,
  loaderClass,
  loaderColor,
  loaderChildren,
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
      {showError && !errorComponent && (
        <div className={`${errorClass} ${classes.error}`}>
          <div className={classes.progressRoot}>
            <div>{`${errorTitle}${error}`}</div>
            {loaderChildren}
          </div>
        </div>
      )}
      {showError && errorComponent}

      {showLoading && (
        <div className={`${loaderClass} ${classes.loader}`}>
          {showLoadingIndefinite && (
            <div className={classes.progressRoot}>
              <div className={classes.progressContainer}>
                <CircularProgress color={loaderColor} size={loaderSize} />
              </div>
              {loaderChildren}
            </div>
          )}
          {showLoadingProgress && (
            <div className={classes.progressRoot}>
              <div className={classes.progressContainer}>
                <CircularProgress
                  color={loaderColor}
                  variant="static"
                  value={progress}
                  size={loaderSize}
                />
                <div className={classes.progressTextContainer}>
                  <Typography variant="h6" color={loaderColor}>
                    {progress ? Math.round(progress) : 0}%
                  </Typography>
                </div>
              </div>

              {loaderChildren}
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
  errorComponent: PropTypes.node,
  errorTitle: PropTypes.string,
  progress: PropTypes.number,
  rootClass: PropTypes.string,
  loaderClass: PropTypes.string,
  errorClass: PropTypes.string,
  children: PropTypes.node,
  loaderChildren: PropTypes.node,
  loaderColor: PropTypes.oneOf(["primary", "secondary", "inherit"]),
};

LoaderLayout.defaultProps = {
  loaderColor: "primary",
};

export default LoaderLayout;
