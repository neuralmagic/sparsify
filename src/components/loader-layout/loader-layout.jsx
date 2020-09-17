import React from "react";
import PropTypes from "prop-types";
import { CircularProgress } from "@material-ui/core";

import makeStyles from "./loader-layout-styles";

function LoaderLayout({ loading, status, error, progress, children }) {
  const showError = !!error;
  const showLoading =
    !showError && (loading || status === "idle" || status === "loading");
  const showLoadingIndefinite = showLoading && progress === undefined;
  const showLoadingProgress = showLoading && !showLoadingIndefinite;
  const showChildren = !showError && !showLoading;

  const useStyles = makeStyles();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {showError && <span className={classes.error}>{error}</span>}

      {showLoading && (
        <div className={classes.container}>
          {showLoadingIndefinite && (
            <CircularProgress color="primary" size={40} />
          )}
          {showLoadingProgress && (
            <CircularProgress
              color="primary"
              variant="static"
              value={progress}
              size={40}
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
  progress: PropTypes.number,
  children: PropTypes.element.isRequired,
};

export default LoaderLayout;
