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
  projectSize: PropTypes.number,
  projectPath: PropTypes.string,
  projectFilename: PropTypes.string,
};

export default ProjectSettingsCard;
