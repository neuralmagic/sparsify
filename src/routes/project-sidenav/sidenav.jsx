import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, List, ListItem, Typography } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { find, propEq, compose, defaultTo } from "ramda";

import makeStyles from "./sidenav-styles";
import {
  getProjectThunk,
  selectProjectsState,
  selectSelectedProjectState,
} from "../../store";
import LoaderLayout from "../../components/loader-layout";
import moment from "moment";
import ScrollerLayout from "../../components/scroller-layout";

function ProjectSideNav({ match }) {
  const useStyles = makeStyles();
  const classes = useStyles();

  const dispatch = useDispatch();
  const projectsState = useSelector(selectProjectsState);
  const selectedProjectState = useSelector(selectSelectedProjectState);

  const projectId = match.params.projectId;
  const selectedProjectMetaData = compose(
    find(propEq("project_id", projectId)),
    defaultTo({})
  )(projectsState.val);

  if (selectedProjectState.projectId !== projectId) {
    dispatch(getProjectThunk({ projectId }));
  }

  const history = useHistory();

  return (
    <ScrollerLayout>
      <div className={classes.header}>
        <Button className={classes.headerButton} onClick={() => history.goBack()}>
          <ArrowBackIosIcon className={classes.headerIcon} />
        </Button>
        <Typography color="textPrimary" className={classes.headerText} noWrap>
          {selectedProjectMetaData ? selectedProjectMetaData.name : ""}
        </Typography>
      </div>

      <LoaderLayout
        error={selectedProjectState.error}
        status={selectedProjectState.status}
        errorTitle="Error loading project"
        loaderSpacingHoriz={2}
        loaderSpacingVert={2}
        errorSpacingHoriz={2}
        errorSpacingVert={2}
      >

      </LoaderLayout>
    </ScrollerLayout>
  );
}

export default ProjectSideNav;
