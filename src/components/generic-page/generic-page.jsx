import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";

import AbsoluteLayout from "../absolute-layout";
import makeStyles from "./generic-page-styles";

const useStyles = makeStyles();

function GenericPage({ title, description, logoComponent, logoClassName }) {
  const classes = useStyles();

  return (
    <AbsoluteLayout spacingTop={4} spacingBottom={4} spacingRight={4} spacingLeft={4}>
      <div className={classes.root}>
        <div className={classes.layout}>
          {logoComponent &&
            React.cloneElement(logoComponent, {
              className: logoClassName
                ? `${classes.icon} ${logoClassName}`
                : classes.icon,
            })}
          <Typography color="textSecondary" variant="h3" align="center">
            {title}
          </Typography>

          <Typography
            color="textSecondary"
            variant="h5"
            align="center"
            className={classes.desc}
          >
            {description}
          </Typography>
        </div>
      </div>
    </AbsoluteLayout>
  );
}

GenericPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  logoComponent: PropTypes.any,
  logoClassName: PropTypes.string,
};

export default GenericPage;
