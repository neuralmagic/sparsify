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
