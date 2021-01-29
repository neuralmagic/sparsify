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
import { Link } from "react-router-dom";
import { ListItem, Typography } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ChevronRight from "@material-ui/icons/ChevronRight";
import PropTypes from "prop-types";

import makeStyles from "./menu-styles";

const useStyles = makeStyles();

function ProjectSideNavMenu({ selected, title, titlePath, collapsible, children }) {
  const classes = useStyles({ selected });
  const icon = collapsible ? children[0] : children;
  const subMenu = collapsible ? children[1] : null;

  return (
    <div className={classes.root}>
      <ListItem button className={classes.item}>
        <Link to={titlePath} className={classes.link}>
          <div className={classes.icon}>{icon}</div>
          <Typography className={classes.title}>{title}</Typography>
          {collapsible && (
            <div className={classes.arrow}>
              {selected ? <ExpandMore /> : <ChevronRight />}
            </div>
          )}
        </Link>
      </ListItem>
      {collapsible && (
        <Collapse
          in={selected}
          timeout="auto"
          unmountOnExit
          className={classes.subContainer}
        >
          {subMenu}
        </Collapse>
      )}
    </div>
  );
}

ProjectSideNavMenu.propTypes = {
  selected: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  titlePath: PropTypes.string.isRequired,
  collapsible: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default ProjectSideNavMenu;
