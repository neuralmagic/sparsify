import React from "react";
import { Redirect } from "react-router-dom";
import { Divider } from "@material-ui/core";
import { ReactComponent as Icon } from "./img/icon.svg";
import PropTypes from "prop-types";
import moment from "moment";

import makeStyles from "./menu-optim-styles";
import { createProjectOptimPath } from "../../paths";
import ProjectSideNavMenu from "../menu";
import ProjectSideNavSubMenuTitle from "../sub-menu-title";
import ProjectSideNavSubMenuItem from "../sub-menu-item";
import LoaderLayout from "../../../components/loader-layout";

const useStyles = makeStyles();

function ProjectSideNavMenuOptim({
  selectedOptimsState,
  selectedProfilesPerfState,
  selectedProfilesLossState,
  projectId,
  action,
  optimId,
  query,
}) {
  const classes = useStyles();

  const selected = action === "optim";
  const profilePerfId = "perf" in query ? query.perf : null;
  const profileLossId = "loss" in query ? query.loss : null;

  if (
    selected &&
    !optimId &&
    selectedOptimsState.projectId === projectId &&
    selectedOptimsState.val &&
    selectedOptimsState.val.length > 0
  ) {
    // redirect to select the first optim
    const selectedOptim = selectedOptimsState.val[0];
    const path = createProjectOptimPath(
      projectId,
      selectedOptim.optim_id,
      selectedOptim.profile_perf_id,
      selectedOptim.profile_loss_id
    );

    return <Redirect to={path} />;
  }

  return (
    <ProjectSideNavMenu
      titlePath={createProjectOptimPath(
        projectId,
        optimId,
        profilePerfId,
        profileLossId
      )}
      title="Optimization"
      selected={selected}
      collapsible={true}
    >
      <Icon />
      <div>
        <ProjectSideNavSubMenuTitle title="Version" showAdd={true} />
        <Divider light className={classes.divider} />
        <LoaderLayout
          status={selectedOptimsState.status}
          error={selectedOptimsState.error}
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
              value={optim.name}
              extraValue={`(${moment(optim.created).fromNow()})`}
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
          <ProjectSideNavSubMenuItem
            path={createProjectOptimPath(projectId, optimId, null, profileLossId)}
            selected={!profilePerfId}
            value="FLOPS"
          />
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
              value={profile.name}
              extraValue={`(${moment(profile.created).fromNow()})`}
            />
          ))}
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
          <ProjectSideNavSubMenuItem
            path={createProjectOptimPath(projectId, optimId, profilePerfId, null)}
            selected={!profileLossId}
            value="Estimated"
          />
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
              value={profile.name}
              extraValue={`(${moment(profile.created).fromNow()})`}
            />
          ))}
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
  query: PropTypes.object,
};

export default ProjectSideNavMenuOptim;
