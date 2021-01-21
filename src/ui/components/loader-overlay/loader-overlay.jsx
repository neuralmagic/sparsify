import React from "react";
import PropTypes from "prop-types";

import { referenceDarkTheme } from "../../app/app-theme";
import makeStyles from "./loader-overlay-styles";
import LoaderLayout from "../loader-layout";
import FadeTransition from "../fade-transition";

const useStyles = makeStyles();

function LoaderOverlay({
  loading,
  status,
  error,
  errorTitle,
  progress,
  loaderSize,
  children,
  loaderChildren,
}) {
  const transTime = 300;
  const classes = useStyles({ transTime });

  if (!loaderSize) {
    loaderSize = 64;
  }

  const showError = !!error;
  const showLoading = loading || status === "idle" || status === "loading";

  return (
    <FadeTransition show={showError || showLoading}>
      <LoaderLayout
        loading={loading}
        status={status}
        error={error}
        errorTitle={errorTitle}
        progress={progress}
        loaderSize={loaderSize}
        rootClass={classes.root}
        loaderClass={classes.loader}
        loaderColor="inherit"
        errorClass={classes.error}
        loaderSize={loaderSize}
        loaderChildren={loaderChildren}
      >
        {children}
      </LoaderLayout>
    </FadeTransition>
  );
}

LoaderOverlay.propTypes = {
  loading: PropTypes.bool,
  status: PropTypes.string,
  error: PropTypes.string,
  errorTitle: PropTypes.string,
  progress: PropTypes.number,
  rootClass: PropTypes.string,
  loaderClass: PropTypes.string,
  errorClass: PropTypes.string,
  children: PropTypes.node,
  loaderChildren: PropTypes.node,
  loaderSize: PropTypes.number,
};

export default LoaderOverlay;
