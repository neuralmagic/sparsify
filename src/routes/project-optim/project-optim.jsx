import React from "react";
import { useSelector } from "react-redux";
import { selectedOptimById } from "../../store";
import OptimPruning from "./optim-pruning";

import AbsoluteLayout from "../../components/absolute-layout";

function ProjectOptim(props) {
  const optim = useSelector(selectedOptimById(props.match.params.optimId))

  return <AbsoluteLayout>
    <OptimPruning optim={optim}></OptimPruning>
  </AbsoluteLayout>;
}

export default ProjectOptim;
