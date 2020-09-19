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
