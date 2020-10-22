import React from 'react'
import PropTypes from "prop-types"
import { useDispatch, useSelector } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'
import {
  changeModifierAdjustableSettings,
  selectModifierAdjustableSettings,
  selectModifierHasCustomLayerEdits } from '../../store'

import makeStyles from "./pruning-settings-styles"

const useStyles = makeStyles()

const PruningSettings = ({ showRecovery = true, className, modifier }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const adjustableSettings = useSelector(selectModifierAdjustableSettings(modifier.modifier_id))
  const hasCustomLayerEdits = useSelector(
    selectModifierHasCustomLayerEdits(modifier.modifier_id)
  );
  const changeAdjustableSettings = (settings, commit) =>
    dispatch(changeModifierAdjustableSettings({
      modifierId: modifier.modifier_id,
      settings,
      commit
    }))

  return <div className={`${classes.root} ${className}`} key={modifier.modifier_id}>
    <Typography className={classes.title}>Pruning range</Typography>
    <Grid container direction='column'>
      <Grid item container direction='row' spacing={3} className={classes.rangeContainer}>
        <Grid item>
          <TextField
            variant='outlined'
            size='small'
            label='Start'
            defaultValue={adjustableSettings.start_epoch}
            disabled={hasCustomLayerEdits}
            onChange={e => dispatch(changeModifierAdjustableSettings({
              modifierId: modifier.modifier_id,
              settings: { start_epoch: Number(e.target.value) },
            }))}></TextField>
        </Grid>
        <Grid item>
          <TextField
            variant='outlined'
            size='small'
            label='End'
            defaultValue={adjustableSettings.end_epoch}
            disabled={hasCustomLayerEdits}
            onChange={e => dispatch(changeModifierAdjustableSettings({
              modifierId: modifier.modifier_id,
              settings: { end_epoch: Number(e.target.value) }
            }))}></TextField>
        </Grid>
        <Grid item>
          <TextField
            variant='outlined'
            size='small'
            label='Update'
            defaultValue={adjustableSettings.update_frequency}
            disabled={hasCustomLayerEdits}
            onChange={e => dispatch(changeModifierAdjustableSettings({
              modifierId: modifier.modifier_id,
              settings: { update_frequency: Number(e.target.value) }
            }))}></TextField>
        </Grid>
      </Grid>
      {showRecovery &&
        <Grid className={classes.recoveryContainer} container direction='column' spacing={3}>
          <Grid item>
            <Typography className={classes.balanceTitle}>Pruning Balance</Typography>
          </Grid>
          <Grid item>
            <Slider classes={{
              root: classes.slider,
              markLabel: classes.sliderMarkLabel,
              markLabelActive: classes.sliderMarkLabelActive }}
            min={0}
            max={1}
            disabled={hasCustomLayerEdits}
            value={adjustableSettings.balance_perf_loss} step={0.01}
            marks={[{ value: 0, label: 'Performance' }, { value: 1, label: 'Loss' }]}
            onChange={(e, value) => changeAdjustableSettings({ balance_perf_loss: Number(value) })}
            onChangeCommitted={(e, value) => changeAdjustableSettings({ balance_perf_loss: Number(value) }, true)}/>
          </Grid>
        </Grid>}
    </Grid>
  </div>
}

PruningSettings.propTypes = {
  showRecovery: PropTypes.bool,
  className: PropTypes.string,
  optim: PropTypes.object.isRequired,
  modifier: PropTypes.object.isRequired,
};

export default PruningSettings
