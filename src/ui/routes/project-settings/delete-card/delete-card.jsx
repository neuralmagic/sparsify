import React from "react";
import { Button, CardContent, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import PropTypes from "prop-types";

import makeStyles from "./delete-card-styles";

const useStyles = makeStyles();

function ProjectSettingsDeleteCard({ onDeleteClick }) {
  const classes = useStyles();

  return (
    <Card elevation={1}>
      <CardContent className={classes.layout}>
        <Typography color="textPrimary" className={classes.warning}>
          Once you delete a project, there is no going back. Please be certain.
        </Typography>
        <Button className={classes.button} onClick={onDeleteClick}>
          Delete Project
        </Button>
      </CardContent>
    </Card>
  );
}

ProjectSettingsDeleteCard.propTypes = {
  onDeleteClick: PropTypes.func,
};

export default ProjectSettingsDeleteCard;
