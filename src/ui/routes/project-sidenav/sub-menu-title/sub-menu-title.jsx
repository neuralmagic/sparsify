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
import { Button, Typography } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import PropTypes from "prop-types";

import makeStyles from "./sub-menu-title-styles";

const useStyles = makeStyles();

function ProjectSideNavSubMenuTitle({ title, showAdd, onClick }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography color="textSecondary" variant="subtitle2" noWrap>
        {title}
      </Typography>

      {showAdd && (
        <Button className={classes.addButton} onClick={onClick}>
          <AddCircleOutlineIcon />
        </Button>
      )}
    </div>
  );
}

ProjectSideNavSubMenuTitle.propTypes = {
  title: PropTypes.string.isRequired,
  showAdd: PropTypes.bool,
  onClick: PropTypes.func,
};

export default ProjectSideNavSubMenuTitle;
