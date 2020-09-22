import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Box } from "@material-ui/core";

import { selectSelectedOptimsState } from "../../store";
import { ReactComponent as Icon } from "./img/icon.svg";
import OptimCreate from "../../modals/optim-create";
import GenericPage from "../../components/generic-page";

function ProjectOptim({ match }) {
  const optimsState = useSelector(selectSelectedOptimsState);
  const [isOptimCreateOpen, setIsOptimCreateOpen] = useState(false);

  useEffect(() => {
    if (optimsState.status === "succeeded" && optimsState.val.length === 0) {
      setIsOptimCreateOpen(true);
    }
  }, [optimsState]);

  return (
    <Box>
      <GenericPage
        logoComponent={<Icon />}
        title="Optimization"
        description="Optimize, retrain, and utilize Neural Magic's runtime engine to achieve faster inference timings."
      />
      <OptimCreate
        open={isOptimCreateOpen}
        handleClose={() => setIsOptimCreateOpen(false)}
        projectId={match.params.projectId}
      />
    </Box>
  );
}

export default ProjectOptim;
