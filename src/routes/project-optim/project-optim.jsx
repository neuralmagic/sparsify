import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Box } from "@material-ui/core"

import { 
  selectSelectedOptimsState,
} from "../../store";
import { ReactComponent as Icon } from "./img/icon.svg";
import OptimCreate from "../../modals/optim-create";
import GenericPage from "../../components/generic-page";

function ProjectOptim() {
  const optimsState = useSelector(selectSelectedOptimsState);
  const [isOptimCreateOpen, setIsOptimCreateOpen] = useState(false);

  console.log(optimsState)
  useEffect(() => {
    if (optimsState.status === "succeeded" && optimsState.val.length === 0) {
      setIsOptimCreateOpen(true);
    }
  }, [optimsState])

  return (
    <Box>
      <GenericPage
        logoComponent={<Icon/>}
        title="Optimization"
        description="Optimize, retrain, and utilize Neural Magic's runtime engine to achieve faster inference timings."
      />
      <OptimCreate open={isOptimCreateOpen} handleClose={() => setIsOptimCreateOpen(false)}/>
    </Box>
    
  );
}

export default ProjectOptim;
