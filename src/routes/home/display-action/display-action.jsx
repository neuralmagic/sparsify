import React from "react";
import PropTypes from "prop-types";
import {Divider, Typography} from "@material-ui/core";

import makeStyles from "./display-action-styles";
import DisplayCard from "../../../components/display-card";

const useStyles = makeStyles();

const DisplayAction = ({ children, headerText, bodyText }) => {
  const classes = useStyles();

  return (
    <DisplayCard
      cardClassName={classes.card}
      contentClassName={classes.content}
      showEditButton={false}
      showMoreButton={false}
    >
      <div className={classes.icon}>{children}</div>
      <Divider className={classes.divider} />

      <div>
        <Typography
          className={classes.header}
          color="textPrimary"
          variant="h5"
          align="center"
        >
          {headerText}
        </Typography>
        <Typography color="textSecondary" variant="body1" align="center">
          {bodyText}
        </Typography>
      </div>
    </DisplayCard>
  );
};

DisplayAction.propTypes = {
  children: PropTypes.node.isRequired,
  headerText: PropTypes.string.isRequired,
  bodyText: PropTypes.string.isRequired,
};

export default DisplayAction;
