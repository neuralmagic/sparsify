import React from "react";

import { ReactComponent as Icon } from "./img/icon.svg";
import GenericPage from "../../components/generic-page";

function ProjectBenchmark() {
  return (
    <GenericPage
      logoComponent={<Icon />}
      title="Model Benchmarking"
      description="Coming soon"
    />
  );
}

export default ProjectBenchmark;
