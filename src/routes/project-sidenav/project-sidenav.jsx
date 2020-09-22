import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, List, Typography } from "@material-ui/core";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import { find, propEq, compose, defaultTo } from "ramda";
import queryString from "query-string";

import {
  getOptimsThunk,
  getProfilesLossThunk,
  getProfilesPerfThunk,
  getProjectThunk,
  selectProjectsState,
  selectSelectedOptimsState,
  selectSelectedProfilesLossState,
  selectSelectedProfilesPerfState,
  selectSelectedProjectState,
  setSelectedProfilePerf,
  setSelectedProfileLoss,
  setSelectedOptim,
  setSelectedOptimProfilePerf,
  setSelectedOptimProfileLoss,
} from "../../store";
import { createHomePath } from "../paths";
import makeStyles from "./project-sidenav-styles";
import LoaderLayout from "../../components/loader-layout";
import ScrollerLayout from "../../components/scroller-layout";
import ProjectSideNavMenuProfilePerf from "./menu-profile-perf";
import AbsoluteLayout from "../../components/absolute-layout";
import ProjectSideNavMenuProfileLoss from "./menu-profile-loss";
import ProjectSideNavMenuBenchmark from "./menu-benchmark";
import ProjectSideNavMenuSettings from "./menu-settings";
import ProjectSideNavMenuOptim from "./menu-optim";

const useStyles = makeStyles();

function ProjectSideNav({ match, location }) {
  const classes = useStyles();
  const history = useHistory();

  const projectId = match.params.projectId;
  const action = match.params.action ? match.params.action : null;
  const actionId = match.params.actionId ? match.params.actionId : null;
  const query = queryString.parse(location.search);
  const profilePerfId = "perf" in query ? query.perf : null;
  const profileLossId = "loss" in query ? query.loss : null;

  const dispatch = useDispatch();
  const projectsState = useSelector(selectProjectsState);
  const selectedProjectState = useSelector(selectSelectedProjectState);
  const selectedProfilesPerfState = useSelector(selectSelectedProfilesPerfState);
  const selectedProfilesLossState = useSelector(selectSelectedProfilesLossState);
  const selectedOptimsState = useSelector(selectSelectedOptimsState);

  if (selectedProjectState.projectId !== projectId) {
    // current project doesn't match, preload all necessary data
    dispatch(getProjectThunk({ projectId }));
    dispatch(getProfilesPerfThunk({ projectId }));
    dispatch(getProfilesLossThunk({ projectId }));
    dispatch(getOptimsThunk({ projectId }));
  }

  // handle redux store and state setup for the current route
  // todo, move out to central location to work with store
  useEffect(() => {
    if (action === "perf" && selectedProfilesPerfState.selectedId !== actionId) {
      dispatch(setSelectedProfilePerf(actionId ? actionId : null));
    } else if (action === "loss" && selectedProfilesLossState.selectedId !== actionId) {
      dispatch(setSelectedProfileLoss(actionId ? actionId : null));
    } else if (action === "optim" && selectedOptimsState.selectedOptimId !== actionId) {
      dispatch(setSelectedOptim(actionId ? actionId : null));
    } else if (
      action === "optim" &&
      selectedOptimsState.selectedProfilePerfId !== profilePerfId
    ) {
      dispatch(setSelectedOptimProfilePerf(profilePerfId ? profilePerfId : null));
    } else if (
      action === "optim" &&
      selectedOptimsState.selectedProfileLossId !== profileLossId
    ) {
      dispatch(setSelectedOptimProfileLoss(profileLossId ? profileLossId : null));
    }
  }, [
    dispatch,
    action,
    actionId,
    profilePerfId,
    profileLossId,
    selectedProfilesPerfState,
    selectedProfilesLossState,
    selectedOptimsState,
    selectedOptimsState,
  ]);

  function handleBackClick() {
    history.push(createHomePath());
  }

  // grab from the array as a backup name, if possible,
  // to use while loading the project
  const selectedProjectMetaData = compose(
    find(propEq("project_id", projectId)),
    defaultTo(null)
  )(projectsState.val);

  let projectName = "";

  if (selectedProjectState.val) {
    projectName = selectedProjectState.val.name;
  } else if (selectedProjectMetaData) {
    projectName = selectedProjectMetaData.name;
  }

  return (
    <AbsoluteLayout layoutClass={classes.root}>
      <div className={classes.header}>
        <Button className={classes.headerButton} onClick={handleBackClick}>
          <ChevronLeft />
        </Button>
        <Typography color="textPrimary" className={classes.headerText} noWrap>
          {projectName}
        </Typography>
      </div>
      <Divider />
      <div className={classes.content}>
        <ScrollerLayout spacingTop={2}>
          <LoaderLayout
            error={selectedProjectState.error}
            status={selectedProjectState.status}
            errorTitle="Error loading project"
          >
            <List className={classes.list}>
              <ProjectSideNavMenuProfilePerf
                selectedState={selectedProfilesPerfState}
                projectId={projectId}
                action={action}
                profileId={action === "perf" ? actionId : null}
              />
              <ProjectSideNavMenuProfileLoss
                selectedState={selectedProfilesLossState}
                projectId={projectId}
                action={action}
                profileId={action === "loss" ? actionId : null}
              />
              <ProjectSideNavMenuOptim
                selectedOptimsState={selectedOptimsState}
                selectedProfilesPerfState={selectedProfilesPerfState}
                selectedProfilesLossState={selectedProfilesLossState}
                projectId={projectId}
                action={action}
                optimId={action === "optim" ? actionId : null}
                profilePerfId={profilePerfId}
                profileLossId={profileLossId}
              />
              <ProjectSideNavMenuBenchmark projectId={projectId} action={action} />
              <ProjectSideNavMenuSettings projectId={projectId} action={action} />
            </List>
          </LoaderLayout>
        </ScrollerLayout>
      </div>
    </AbsoluteLayout>
  );
}

export default ProjectSideNav;
