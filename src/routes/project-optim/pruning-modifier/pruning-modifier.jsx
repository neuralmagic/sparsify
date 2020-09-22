import React from "react";
import LayersChart from "../../../components/layers-chart";
import Grid from '@material-ui/core/Grid'
import MetricItem from "../../../components/metric-item"

const PruningModifier = ({ modifier }) => {
  return <Grid container key={modifier.modifier_id} direction="row">
    <Grid direction='column' xs={1}>
      <MetricItem label="Est. Speedup" value="12"/>
      <MetricItem label="Est. Time" value="12"/>
      <MetricItem label="Recoverability" value="12"/>
      <MetricItem label="Total Sparsity" value="12"/>
    </Grid>
    <Grid item xs={11}>
      <LayersChart data={modifier.nodes} sparsityProp="sparsity" denseProp="est_time" sparseProp="est_time_baseline"/>
    </Grid>
  </Grid>
}

export default PruningModifier;
