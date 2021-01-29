/*
Copyright 2021-present Neuralmagic, Inc.

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
import { CardContent } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";

import makeStyles from "./project-settings-card-styles";
import ProjectSettingsCardInfoRow from "./info-row";
import { readableBytes } from "../../../components";

const useStyles = makeStyles();

function ProjectSettingsCard({
  projectName,
  projectNameValError,
  projectNameOnChange,
  projectDesc,
  projectDescValError,
  projectDescOnChange,
  projectCreated,
  projectModified,
  projectSize,
  projectPath,
  projectFilename,
}) {
  const classes = useStyles();

  return (
    <Card elevation={1}>
      <CardContent className={classes.layout}>
        <TextField
          id="projectName"
          variant="outlined"
          type="text"
          label="Name"
          value={projectName}
          error={!!projectNameValError}
          helperText={projectNameValError}
          className={`${classes.cardInputRow} ${classes.name}`}
          onChange={projectNameOnChange}
        />
        <TextField
          id="projectDesc"
          variant="outlined"
          type="text"
          label="Description"
          multiline
          rows={5}
          value={projectDesc}
          error={!!projectDescValError}
          helperText={projectDescValError}
          className={`${classes.cardInputRow}`}
          onChange={projectDescOnChange}
        />
        <ProjectSettingsCardInfoRow
          label="Created"
          value={projectCreated}
          className={classes.cardInfoRow}
        />
        <ProjectSettingsCardInfoRow
          label="Last Modified"
          value={projectModified}
          className={classes.cardInfoRow}
        />
        <ProjectSettingsCardInfoRow
          label="Size on disk"
          value={readableBytes(projectSize)}
          className={classes.cardInfoRow}
        />
        <ProjectSettingsCardInfoRow
          label="Server path"
          value={projectPath}
          showTooltip={true}
          className={classes.cardInfoRow}
        />
        <ProjectSettingsCardInfoRow
          label="Model file"
          value={projectFilename}
          className={classes.cardInfoRow}
        />
      </CardContent>
    </Card>
  );
}

ProjectSettingsCard.propTypes = {
  projectName: PropTypes.string,
  projectNameValError: PropTypes.string,
  projectNameOnChange: PropTypes.func,
  projectDesc: PropTypes.string,
  projectDescValError: PropTypes.string,
  projectDescOnChange: PropTypes.func,
  projectCreated: PropTypes.string,
  projectModified: PropTypes.string,
  projectSize: PropTypes.number,
  projectPath: PropTypes.string,
  projectFilename: PropTypes.string,
};

export default ProjectSettingsCard;
