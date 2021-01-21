import React from "react";
import { ReactComponent as Icon } from "./img/icon.svg";
import PropTypes from "prop-types";

import { createProjectSettingsPath } from "../../paths";
import ProjectSideNavMenu from "../menu";

function ProjectSideNavMenuSettings({ projectId, action }) {
  const selected = action === "settings";

  return (
    <ProjectSideNavMenu
      titlePath={createProjectSettingsPath(projectId)}
      title="Settings"
      selected={selected}
      collapsible={false}
    >
      <Icon />
    </ProjectSideNavMenu>
  );
}

ProjectSideNavMenuSettings.propTypes = {
  projectId: PropTypes.string.isRequired,
  action: PropTypes.string,
};

export default ProjectSideNavMenuSettings;
