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
import { Link } from "react-router-dom";
import { ListItem, Typography } from "@material-ui/core";
import ChevronRight from "@material-ui/icons/ChevronRight";
import PropTypes from "prop-types";

import makeStyles from "./sub-menu-item-styles";
import NullableText from "../../../components/nullable-text";

const useStyles = makeStyles();

function ProjectSideNavSubMenuItem({ selected, value, extraValue, path }) {
  const classes = useStyles({ selected });

  if (!extraValue) {
    extraValue = "";
  }

  return (
    <ListItem button className={classes.root}>
      <Link to={path} className={classes.link}>
        <Typography variant="subtitle2" className={classes.title} noWrap>
          <NullableText placeholder="Unspecified" value={value}>
            {value ? value : ""}
          </NullableText>
          &nbsp;
          <i>{extraValue}</i>
        </Typography>
      </Link>
      {selected && <ChevronRight className={classes.selectedIcon} />}
    </ListItem>
  );
}

ProjectSideNavSubMenuItem.propTypes = {
  selected: PropTypes.bool.isRequired,
  value: PropTypes.string,
  extraValue: PropTypes.string,
  path: PropTypes.string.isRequired,
};

export default ProjectSideNavSubMenuItem;
