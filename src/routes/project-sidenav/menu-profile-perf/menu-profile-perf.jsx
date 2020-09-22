import React from "react";
import { Divider } from "@material-ui/core";
import { ReactComponent as Icon } from "./img/icon.svg";
import PropTypes from "prop-types";
import moment from "moment";

import makeStyles from "./menu-profile-perf-styles";
import { createProjectPerfPath } from "../../paths";
import ProjectSideNavMenu from "../menu";
import ProjectSideNavSubMenuTitle from "../sub-menu-title";
import ProjectSideNavSubMenuItem from "../sub-menu-item";
import LoaderLayout from "../../../components/loader-layout";

const useStyles = makeStyles();

function ProjectSideNavMenuProfilePerf({
  selectedState,
  projectId,
  action,
  profileId,
}) {
  const classes = useStyles();
  const selected = action === "perf";

  return (
    <ProjectSideNavMenu
      titlePath={createProjectPerfPath(projectId, profileId)}
      title="Performance Profiles"
      selected={selected}
      collapsible={true}
    >
      <Icon />
      <LoaderLayout
        status={selectedState.status}
        error={selectedState.error}
        errorTitle="Error loading performance profiles"
        loaderSize={28}
        rootClass={classes.loaderLayout}
      >
        <ProjectSideNavSubMenuTitle title="Profile" showAdd={true} />
        <Divider light className={classes.divider} />
        <ProjectSideNavSubMenuItem
          path={createProjectPerfPath(projectId, null)}
          selected={!profileId}
          value="FLOPS"
        />
        {selectedState.val.map((profile) => (
          <ProjectSideNavSubMenuItem
            key={profile.profile_id}
            path={createProjectPerfPath(projectId, profile.profile_id)}
            selected={profileId === profile.profile_id}
            value={profile.name}
            extraValue={`(${moment(profile.created).fromNow()})`}
          />
        ))}
      </LoaderLayout>
    </ProjectSideNavMenu>
  );
}

ProjectSideNavMenuProfilePerf.propTypes = {
  selectedState: PropTypes.object.isRequired,
  projectId: PropTypes.string.isRequired,
  action: PropTypes.string,
  profileId: PropTypes.string,
};

export default ProjectSideNavMenuProfilePerf;
