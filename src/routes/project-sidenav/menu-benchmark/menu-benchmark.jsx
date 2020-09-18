import React from "react";
import { ReactComponent as Icon } from "./img/icon.svg";
import PropTypes from "prop-types";

import { createProjectBenchmarksPath } from "../../paths";
import ProjectSideNavMenu from "../menu";

function ProjectSideNavMenuBenchmark({ projectId, action }) {
  const selected = action === "bench";

  return (
    <ProjectSideNavMenu
      titlePath={createProjectBenchmarksPath(projectId)}
      title="Benchmarks"
      selected={selected}
      collapsible={false}
    >
      <Icon />
    </ProjectSideNavMenu>
  );
}

ProjectSideNavMenuBenchmark.propTypes = {
  projectId: PropTypes.string.isRequired,
  action: PropTypes.string,
};

export default ProjectSideNavMenuBenchmark;
