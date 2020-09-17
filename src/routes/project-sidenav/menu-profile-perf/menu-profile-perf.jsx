import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, List, ListItem, Typography } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { find, propEq, compose, defaultTo } from "ramda";

import makeStyles from "./menu-profile-perf-styles";
import {
  getProfilesPerfThunk,
  selectSelectedProfilesPerfState,
} from "../../../store";

function ProjectSideNavMenuProfilePerf({projectId, profileId, selected}) {
  const useStyles = makeStyles();
  const classes = useStyles();

  const dispatch = useDispatch();
  const selectedProfilesPerfState = useSelector(selectSelectedProfilesPerfState);

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
        <List className={classes.listRoot}></List>
      </LoaderLayout>
    </ScrollerLayout>
  );
}

export default ProjectSideNav;
