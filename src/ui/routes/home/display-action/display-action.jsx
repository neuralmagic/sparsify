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
import PropTypes from "prop-types";
import { Divider, Typography } from "@material-ui/core";

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
