import React from "react";
import { Divider } from "@material-ui/core";
import { ReactComponent as Icon } from "./img/icon.svg";
import PropTypes from "prop-types";
import moment from "moment";

import makeStyles from "./menu-profile-loss-styles";
import { createProjectLossPath } from "../../paths";
import ProjectSideNavMenu from "../menu";
import ProjectSideNavSubMenuTitle from "../sub-menu-title";
import ProjectSideNavSubMenuItem from "../sub-menu-item";
import LoaderLayout from "../../../components/loader-layout";

const useStyles = makeStyles();

function ProjectSideNavMenuProfileLoss({
  selectedState,
  projectId,
  action,
  profileId,
}) {
  const classes = useStyles();
  const selected = action === "loss";

  return (
    <ProjectSideNavMenu
      titlePath={createProjectLossPath(projectId, profileId)}
      title="Loss Profiles"
      selected={selected}
      collapsible={true}
    >
      <Icon />
      <LoaderLayout
        status={selectedState.status}
        error={selectedState.error}
        errorTitle="Error loading loss profiles"
        loaderSize={28}
        rootClass={classes.loaderLayout}
      >
        <ProjectSideNavSubMenuTitle title="Profile" showAdd={true} />
        <Divider light className={classes.divider} />
        {selectedState.val.map((profile) => (
          <ProjectSideNavSubMenuItem
            key={profile.profile_id}
            path={createProjectLossPath(projectId, profile.profile_id)}
            selected={profileId === profile.profile_id}
            value={profile.name}
            extraValue={`(${moment(profile.created).fromNow()})`}
          />
        ))}
        <ProjectSideNavSubMenuItem
          path={createProjectLossPath(projectId, null)}
          selected={!profileId}
          value="Approximated"
        />
      </LoaderLayout>
    </ProjectSideNavMenu>
  );
}

ProjectSideNavMenuProfileLoss.propTypes = {
  selectedState: PropTypes.object.isRequired,
  projectId: PropTypes.string.isRequired,
  action: PropTypes.string,
  profileId: PropTypes.string,
};

export default ProjectSideNavMenuProfileLoss;
