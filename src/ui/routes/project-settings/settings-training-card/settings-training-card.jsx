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
import PropTypes from "prop-types";

import ProjectSettingsContainer from "../../../components/project-settings-container";
import makeStyles from "./settings-training-card-styles";

const useStyles = makeStyles();

function ProjectSettingsTrainingCard({
  optimizer,
  optimizerValError,
  optimizerOnChange,
  epochs,
  epochsValError,
  epochsOnChange,
  initLR,
  initLRValError,
  initLROnChange,
  finalLR,
  finalLRValError,
  finalLROnChange,
}) {
  const classes = useStyles();

  return (
    <Card elevation={1}>
      <CardContent className={classes.layout}>
        <ProjectSettingsContainer
          optimizer={optimizer}
          optimizerValError={optimizerValError}
          optimizerOnChange={optimizerOnChange}
          epochs={epochs}
          epochsValError={epochsValError}
          epochsOnChange={epochsOnChange}
          initLR={initLR}
          initLRValError={initLRValError}
          initLROnChange={initLROnChange}
          finalLR={finalLR}
          finalLRValError={finalLRValError}
          finalLROnChange={finalLROnChange}
        />
      </CardContent>
    </Card>
  );
}

ProjectSettingsTrainingCard.propTypes = {
  optimizer: PropTypes.string,
  optimizerValError: PropTypes.string,
  optimizerOnChange: PropTypes.func,
  epochs: PropTypes.string,
  epochsValError: PropTypes.string,
  epochsOnChange: PropTypes.func,
  initLR: PropTypes.string,
  initLRValError: PropTypes.string,
  initLROnChange: PropTypes.func,
  finalLR: PropTypes.string,
  finalLRValError: PropTypes.string,
  finalLROnChange: PropTypes.func,
};

export default ProjectSettingsTrainingCard;
