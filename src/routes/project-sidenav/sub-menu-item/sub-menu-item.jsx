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
