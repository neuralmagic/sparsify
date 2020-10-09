import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Divider } from "@material-ui/core";
import { ReactComponent as Icon } from "./img/icon.svg";
import PropTypes from "prop-types";
import moment from "moment";
import _ from "lodash";

import {
  clearOptim,
  createOptimThunk,
  getOptimsThunk,
  selectCreatedOptimsState,
  selectDefaultProfilesLoss,
  selectDefaultProfilesPerf,
  STATUS_IDLE,
  STATUS_SUCCEEDED,
  updateOptimsThunk,
} from "../../../store";
import makeStyles from "./menu-optim-styles";
import { createProjectOptimPath } from "../../paths";
import ProjectSideNavMenu from "../menu";
import ProjectSideNavSubMenuTitle from "../sub-menu-title";
import ProjectSideNavSubMenuItem from "../sub-menu-item";
import LoaderLayout from "../../../components/loader-layout";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles();

function ProjectSideNavMenuOptim({
  selectedOptimsState,
  selectedProfilesPerfState,
  selectedProfilesLossState,
  projectId,
  action,
  optimId,
  profilePerfId,
  profileLossId,
}) {
  const createOptimState = useSelector(selectCreatedOptimsState);
  const defaultPerf = useSelector(selectDefaultProfilesPerf);
  const defaultLoss = useSelector(selectDefaultProfilesLoss);
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const selected = action === "optim";

  const {
    selectedId,
    selectedProfileLossId,
    selectedProfilePerfId,
  } = selectedOptimsState;

  useEffect(() => {
    const selectedOptim = selectedOptimsState.val.find(
      (optim) => optim.optim_id === optimId
    );
    if (
      selected &&
      selectedOptim &&
      optimId !== null &&
      (!selectedId ||
        (selectedId === optimId &&
          (selectedProfileLossId !== profileLossId ||
            selectedProfilePerfId !== profilePerfId)))
    ) {
      dispatch(
        updateOptimsThunk({
          projectId,
          optimId,
          profilePerfId,
          profileLossId,
        })
      );
    }
  }, [
    selectedId,
    selectedProfileLossId,
    selectedProfilePerfId,
    optimId,
    profilePerfId,
    profileLossId,
  ]);

  const dateUtcToLocal = (date) => moment.utc(date).local();

  useEffect(() => {
    if (createOptimState.status === STATUS_SUCCEEDED) {
      dispatch(getOptimsThunk({ projectId }));
      history.push(
        createProjectOptimPath(
          projectId,
          createOptimState.val.optim_id,
          _.get(defaultPerf, "profile_id"),
          _.get(defaultLoss, "profile_id")
        )
      );
      dispatch(clearOptim());
    }
  }, [createOptimState.status, defaultLoss, defaultPerf, dispatch]);

  return (
    <ProjectSideNavMenu
      titlePath={createProjectOptimPath(
        projectId,
        optimId,
        _.get(defaultPerf, "profile_id"),
        _.get(defaultLoss, "profile_id")
      )}
      title="Optimization"
      selected={selected}
      collapsible={true}
    >
      <Icon />
      <div>
        <ProjectSideNavSubMenuTitle
          onClick={() => {
            dispatch(
              createOptimThunk({
                projectId,
              })
            );
          }}
          title="Version"
          showAdd={true}
        />
        <Divider light className={classes.divider} />
        <LoaderLayout
          status={
            createOptimState.status !== STATUS_IDLE
              ? createOptimState.status
              : selectedOptimsState.status
          }
          error={
            createOptimState.error ? createOptimState.error : selectedOptimsState.error
          }
          errorTitle="Error loading optims"
          loaderSize={28}
          rootClass={classes.loaderLayout}
        >
          {selectedOptimsState.val.map((optim) => (
            <ProjectSideNavSubMenuItem
              key={optim.optim_id}
              path={createProjectOptimPath(
                projectId,
                optim.optim_id,
                profilePerfId,
                profileLossId
              )}
              selected={optimId === optim.optim_id}
              value={
                optim.name || dateUtcToLocal(optim.created).format("MM/DD/YYYY h:mma")
              }
              extraValue={
                optim.name ? `(${dateUtcToLocal(optim.created).fromNow()})` : ""
              }
            />
          ))}
        </LoaderLayout>

        <div className={classes.spacer} />

        <ProjectSideNavSubMenuTitle title="Performance Profile" showAdd={false} />
        <Divider light className={classes.divider} />
        <LoaderLayout
          status={selectedProfilesPerfState.status}
          error={selectedProfilesPerfState.error}
          errorTitle="Error loading performance profiles"
          loaderSize={28}
          rootClass={classes.loaderLayout}
        >
          {selectedProfilesPerfState.val.map((profile) => (
            <ProjectSideNavSubMenuItem
              key={profile.profile_id}
              path={createProjectOptimPath(
                projectId,
                optimId,
                profile.profile_id,
                profileLossId
              )}
              selected={profilePerfId === profile.profile_id}
              value={
                profile.name ||
                dateUtcToLocal(profile.created).format("MM/DD/YYYY h:mma")
              }
              extraValue={
                profile.name ? `(${dateUtcToLocal(profile.created).fromNow()})` : ""
              }
            />
          ))}
          <ProjectSideNavSubMenuItem
            path={createProjectOptimPath(projectId, optimId, null, profileLossId)}
            selected={!profilePerfId}
            value="FLOPS"
          />
        </LoaderLayout>

        <div className={classes.spacer} />

        <ProjectSideNavSubMenuTitle title="Loss Profile" showAdd={false} />
        <Divider light className={classes.divider} />
        <LoaderLayout
          status={selectedProfilesLossState.status}
          error={selectedProfilesLossState.error}
          errorTitle="Error loading loss profiles"
          loaderSize={28}
          rootClass={classes.loaderLayout}
        >
          {selectedProfilesLossState.val.map((profile) => (
            <ProjectSideNavSubMenuItem
              key={profile.profile_id}
              path={createProjectOptimPath(
                projectId,
                optimId,
                profilePerfId,
                profile.profile_id
              )}
              selected={profileLossId === profile.profile_id}
              value={
                profile.name ||
                dateUtcToLocal(profile.created).format("MM/DD/YYYY h:mma")
              }
              extraValue={
                profile.name ? `(${dateUtcToLocal(profile.created).fromNow()})` : ""
              }
            />
          ))}
          <ProjectSideNavSubMenuItem
            path={createProjectOptimPath(projectId, optimId, profilePerfId, null)}
            selected={!profileLossId}
            value="Approximated"
          />
        </LoaderLayout>
      </div>
    </ProjectSideNavMenu>
  );
}

ProjectSideNavMenuOptim.propTypes = {
  selectedOptimsState: PropTypes.object.isRequired,
  selectedProfilesPerfState: PropTypes.object.isRequired,
  selectedProfilesLossState: PropTypes.object.isRequired,
  projectId: PropTypes.string.isRequired,
  action: PropTypes.string,
  optimId: PropTypes.string,
  profilePerfId: PropTypes.string,
  profileLossId: PropTypes.string,
};

export default ProjectSideNavMenuOptim;
