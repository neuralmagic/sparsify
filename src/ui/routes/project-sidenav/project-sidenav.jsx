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
  selectDefaultProfilesLoss,
  selectDefaultProfilesPerf,
  setSelectedOptim,
  setSelectedOptimProfilePerf,
  setSelectedOptimProfileLoss,
  STATUS_SUCCEEDED,
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
  const defaultPerf = useSelector(selectDefaultProfilesPerf);
  const defaultLoss = useSelector(selectDefaultProfilesLoss);

  useEffect(() => {
    if (selectedProjectState.projectId !== projectId) {
      // current project doesn't match, preload all necessary data
      dispatch(getProjectThunk({ projectId }));
      dispatch(getProfilesPerfThunk({ projectId }));
      dispatch(getProfilesLossThunk({ projectId }));
      dispatch(getOptimsThunk({ projectId }));
      dispatch(setSelectedOptim(null));
      dispatch(setSelectedProfileLoss(null));
      dispatch(setSelectedOptimProfileLoss(null));
      dispatch(setSelectedProfilePerf(null));
      dispatch(setSelectedOptimProfilePerf(null));
    }
  }, [dispatch, selectProjectsState, projectId]);

  useEffect(() => {
    if (selectedOptimsState.status === STATUS_SUCCEEDED) {
      dispatch(
        setSelectedOptimProfileLoss(defaultLoss ? defaultLoss.profile_id : null)
      );
      dispatch(
        setSelectedOptimProfilePerf(defaultPerf ? defaultPerf.profile_id : null)
      );
    }
  }, [selectedOptimsState.status, projectId]);

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
    } else if (action === "settings") {
      dispatch(getProjectThunk({ projectId }));
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

  useEffect(() => {
    if (selectedProjectState.error && selectedProjectMetaData === undefined) {
      history.replace("/not-found");
    }
  }, [selectedProjectState, selectedProjectMetaData, history]);

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
            errorComponent={
              <List className={classes.list}>
                <ProjectSideNavMenuSettings projectId={projectId} action={action} />
              </List>
            }
          >
            <List className={classes.list}>
              <ProjectSideNavMenuProfilePerf
                selectedState={selectedProfilesPerfState}
                projectId={projectId}
                action={action}
                profileId={
                  action === "perf" ? actionId : selectedProfilesPerfState.selectedId
                }
              />
              <ProjectSideNavMenuProfileLoss
                selectedState={selectedProfilesLossState}
                projectId={projectId}
                action={action}
                profileId={
                  action === "loss" ? actionId : selectedProfilesLossState.selectedId
                }
              />
              <ProjectSideNavMenuOptim
                selectedOptimsState={selectedOptimsState}
                selectedProfilesPerfState={selectedProfilesPerfState}
                selectedProfilesLossState={selectedProfilesLossState}
                projectId={projectId}
                action={action}
                optimId={action === "optim" ? actionId : selectedOptimsState.selectedId}
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
