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
