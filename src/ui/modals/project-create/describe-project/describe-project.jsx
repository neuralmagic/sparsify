/*
Copyright (c) 2021 - present / Neuralmagic, Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
