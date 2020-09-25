import React from 'react'
import PropTypes from "prop-types"
import { useDispatch, useSelector } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'
import { changeModifierAdjustableSettings, selectModifierAdjustableSettings } from '../../store'

import makeStyles from "./pruning-settings-styles"

const useStyles = makeStyles()

const PruningSettings = ({ showRecovery = true, className, modifier }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const adjustableSettings = useSelector(selectModifierAdjustableSettings(modifier.modifier_id))

  return <div className={`${classes.root} ${className}`} key={modifier.modifier_id}>
    <Typography className={classes.title}>Pruning range</Typography>
    <Grid container direction='column'>
      <Grid item container direction='row' spacing={3} className={classes.rangeContainer}>
        <Grid item>
          <TextField variant='outlined' size='small' label='Start' defaultValue={adjustableSettings.start_epoch}
            onChange={e => dispatch(changeModifierAdjustableSettings({
              modifierId: modifier.modifier_id,
              settings: { start_epoch: Number(e.target.value) },
            }))}></TextField>
        </Grid>
        <Grid item>
          <TextField variant='outlined' size='small' label='End' defaultValue={adjustableSettings.end_epoch}
            onChange={e => dispatch(changeModifierAdjustableSettings({
              modifierId: modifier.modifier_id,
              settings: { end_epoch: Number(e.target.value) }
            }))}></TextField>
        </Grid>
        <Grid item>
          <TextField variant='outlined' size='small' label='Update' defaultValue={adjustableSettings.update_frequency}
            onChange={e => dispatch(changeModifierAdjustableSettings({
              modifierId: modifier.modifier_id,
              settings: { update_frequency: Number(e.target.value) }
            }))}></TextField>
        </Grid>
      </Grid>
      {showRecovery &&
        <Grid className={classes.recoveryContainer} container direction='row' spacing={3} alignItems="center">
          <Grid item>
            <TextField variant='outlined' size='small' label='Recovery' value={adjustableSettings.balance_perf_loss}></TextField>
          </Grid>
          <Grid item>
            <Slider className={classes.slider} min={0} max={1} value={adjustableSettings.balance_perf_loss} step={0.01}
              onChange={(e, value) =>
                dispatch(changeModifierAdjustableSettings({
                  modifierId: modifier.modifier_id,
                  settings: { balance_perf_loss: Number(value) }
                })
                )}/>
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
