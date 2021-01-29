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
import { useSelector } from "react-redux";
import { Typography } from "@material-ui/core";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";

import { ReactComponent as Icon } from "./img/icon.svg";
import AbsoluteLayout from "../../components/absolute-layout";
import GenericPage from "../../components/generic-page";
import { selectSelectedProjectState } from "../../store";
import LoaderLayout from "../../components/loader-layout";
import NullableText from "../../components/nullable-text";
import makeStyles from "./project-styles";

const useStyles = makeStyles();

function Project() {
  const classes = useStyles();

  const selectedProjectState = useSelector(selectSelectedProjectState);
  const projectName = selectedProjectState.val ? selectedProjectState.val.name : "";
  const projectDesc = selectedProjectState.val
    ? selectedProjectState.val.description
    : "";

  return (
    <AbsoluteLayout spacingTop={4} spacingBottom={4} spacingRight={4} spacingLeft={4}>
      <LoaderLayout
        status={selectedProjectState.status}
        error={selectedProjectState.error}
        rootClass={classes.root}
        errorComponent={
          <GenericPage
            title="Error Retrieving Model"
            description={selectedProjectState.error}
            logoComponent={<SentimentVeryDissatisfiedIcon />}
          />
        }
      >
        <div className={classes.layout}>
          <div className={classes.icon}>
            <Icon />
          </div>
          <Typography color="textSecondary" variant="h3" align="center">
            <NullableText placeholder="Project Unnamed" value={projectName}>
              {projectName}
            </NullableText>
          </Typography>
          {projectDesc && (
            <Typography
              color="textSecondary"
              variant="h5"
              align="center"
              className={classes.desc}
            >
              {projectDesc}
            </Typography>
          )}
        </div>
      </LoaderLayout>
    </AbsoluteLayout>
  );
}

export default Project;
