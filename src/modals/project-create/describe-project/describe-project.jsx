import React from "react";
import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";

import makeStyles from "./describe-project-styles";
import ScrollerLayout from "../../../components/scroller-layout";

const useStyles = makeStyles();

function DescribeProject({ name, description, handleName, handleDescription }) {
  const classes = useStyles();

  return (
    <div className={classes.content}>
      <Typography>Name and describe this project</Typography>
      <TextField
        id="projectName"
        variant="outlined"
        type="text"
        label="Project Name"
        value={name}
        onChange={(e) => handleName(e.target.value)}
        className={classes.textField}
      />
      <TextField
        id="projectDescription"
        variant="outlined"
        type="text"
        label="Project Description"
        value={description}
        multiline
        rows={3}
        onChange={(e) => handleDescription(e.target.value)}
        className={classes.textField}
      />
    </div>
  );
}

DescribeProject.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  handleName: PropTypes.func,
  handleDescription: PropTypes.func,
};

export default DescribeProject;
