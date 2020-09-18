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

function ProjectSideNavMenuOptim({
  selectedOptimsState,
  selectedProfilesPerfState,
  selectedProfilesLossState,
  projectId,
  action,
  profileId,
  query,
}) {
  const selected = action === "optim";

  const useStyles = makeStyles();
  const classes = useStyles();

  if (
    selected &&
    !profileId &&
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
      titlePath={createProjectOptimPath(projectId, profileId)}
      title="Optimization"
      selected={selected}
      collapsible={true}
    >
      <Icon />
      <LoaderLayout
        status={selectedOptimsState.status}
        error={selectedOptimsState.error}
        errorTitle="Error loading optims"
        loaderSize={28}
        rootClass={classes.loaderLayout}
      >
        <ProjectSideNavSubMenuTitle title="Versions" showAdd={true} />
        <Divider light className={classes.divider} />
        {selectedOptimsState.val.map((optim) => (
          <ProjectSideNavSubMenuItem
            key={optim.optim_id}
            path={createProjectOptimPath(
              projectId,
              optim.optim_id,
              optim.profile_perf_id,
              optim.profile_loss_id
            )}
            selected={profileId === optim.optim_id}
            value={optim.name}
            extraValue={`(${moment(optim.created).fromNow()})`}
          />
        ))}
      </LoaderLayout>
    </ProjectSideNavMenu>
  );
}

ProjectSideNavMenuOptim.propTypes = {
  selectedOptimsState: PropTypes.object.isRequired,
  selectedProfilesPerfState: PropTypes.object.isRequired,
  selectedProfilesLossState: PropTypes.object.isRequired,
  projectId: PropTypes.string.isRequired,
  action: PropTypes.string,
  profileId: PropTypes.string,
  query: PropTypes.string,
};

export default ProjectSideNavMenuOptim;
