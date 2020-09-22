import React from "react"
import PropTypes from 'prop-types'
import { curry } from "ramda"
import { useDispatch } from "react-redux"
import LayersChart from "../../../components/layers-chart"
import Grid from '@material-ui/core/Grid'
import MetricItem from "../../../components/metric-item"
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'

import makeStyles from "./pruning-modifier-styles"

import { changeModifierSettingsThunk } from '../../../store'

const useStyles = makeStyles()

export const formatMetricValue = curry(({ mantissaLength }, value) =>
  value ? value.toFixed(mantissaLength) : '--')

export const formatWithMantissa = (length, value) => formatMetricValue({ mantissaLength: length }, value)

const PruningModifier = ({ modifier, optim }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  return <Grid container key={modifier.modifier_id} direction="row">
    <Grid direction='column' xs={1}>
      <MetricItem label="Est. Speedup" value={formatWithMantissa(2, modifier.est_perf_gain)}/>
      <MetricItem label="Est. Time" value={formatWithMantissa(4, modifier.est_time)}/>
      <MetricItem label="Recoverability" value={formatWithMantissa(4, modifier.est_recovery)}/>
    </Grid>
    <Grid item xs={8}>
      <LayersChart data={modifier.nodes} sparsityProp="sparsity" denseProp="est_time" sparseProp="est_time_baseline"/>
    </Grid>
    <Grid item container xs={3} direction="row" spacing={2}>
      <Grid item>
        <TextField value={`${Math.round(modifier.sparsity * 100)}%`} className={classes.sparsityInput} size="small" variant="outlined" label="Sparsity"/>
      </Grid>
      <Grid item xs>
        <Slider value={modifier.sparsity * 100} onChange={(e, value) => dispatch(changeModifierSettingsThunk({
          projectId: optim.project_id,
          optimId: optim.optim_id,
          modifierId: modifier.modifier_id,
          settings: { sparsity: value / 100 },
        }))}/>
      </Grid>
    </Grid>
  </Grid>
}

PruningModifier.propTypes = {
  optim: PropTypes.object.isRequired,
  modifier: PropTypes.object.isRequired
}

export default PruningModifier;
