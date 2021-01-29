/*
Copyright (c) 2021 - present / Neuralmagic, Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
