import { compose, filter, contains, prop, defaultTo, when, always, not, isNil } from 'ramda'
import React, { useState } from 'react'
import clsx from 'clsx'
import { useSelector, useDispatch } from 'react-redux'
import { Typography, IconButton, Grid, TextField, Table, TableBody, Dialog, DialogTitle,
  TableCell, TableContainer, TableHead, TableRow, Switch, Slider, DialogContent, Box } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import LayersChart from '../../components/layers-chart'
import MetricItem from '../../components/metric-item'
import { formatWithMantissa } from '../../components'
import PruningSettings from '../../components/pruning-settings'

import makeStyles, { makeTableStyles, makeFiltersStyles } from "./optim-advanced-pruning-styles"
import {
  selectModifierAdjustableSettings,
  changeModifierAdjustableSettings,
  changeLayerAdjustableSettings,
  selectLayerAdjustableSettings
} from "../../store";

const useStyles = makeStyles()
const tableStyles = makeTableStyles()
const filtersStyles = makeFiltersStyles()

const SummaryMetrics = ({ modifier }) =>
  <Grid container direction='column'>
    <MetricItem label='Est. Speedup' value={`${modifier.est_perf_gain ? formatWithMantissa(2, modifier.est_perf_gain) + 'x' : '--'}`}/>
    <MetricItem label='Est. Time' value={formatWithMantissa(2, modifier.est_time)}/>
    <MetricItem label='Recoverability' value={formatWithMantissa(4, modifier.est_recovery)}/>
    <MetricItem label='Total Sparsity' value={Math.round(modifier.sparsity * 100)}/>
  </Grid>

const DetailedMetrics = ({ modifier }) =>
  <Grid container direction='row' spacing={3} justify='flex-end'>
    <Grid item direction='column'>
      {[{ label: 'Est. Baseline Time', value: formatWithMantissa(3, modifier.est_time_baseline) },
        { label: 'Baseline Parameters', value: '--' },
        { label: 'Baseline FLOPS', value: '--' }].map(MetricItem)}
    </Grid>
    <Grid item direction='column'>
      {[{ label: 'Est. Current Time', value: '--' },
        { label: 'Current Parameters', value: '--' },
        { label: 'Current FLOPS', value: '--' }].map(MetricItem)}
    </Grid>
  </Grid>

const Filters = ({ modifier }) => {
  const classes = filtersStyles()
  const dispatch = useDispatch()
  const adjustableSettings = useSelector(selectModifierAdjustableSettings(modifier.modifier_id))

  return <Grid container direction='column' spacing={3}>
    <Grid item container direction="row" alignItems="center" spacing={2}>
      <Grid item>
        <TextField
          className={classes.input}
          value={`${Math.round(adjustableSettings.sparsity * 100)}%`}
          size="small"
          variant="outlined"
          label="Sparsity"
        />
      </Grid>
      <Grid item xs>
        <Slider
          value={adjustableSettings.sparsity * 100}
          onChange={(e, value) =>
            dispatch(
              changeModifierAdjustableSettings({
                modifierId: modifier.modifier_id,
                settings: { sparsity: value / 100 }
              })
            )
          }
        />
      </Grid>
    </Grid>
    <Grid item>Preset filters</Grid>
    {[{ name: 'filter_min_sparsity', label: 'Min sparsity', value: Math.round(adjustableSettings.filter_min_sparsity * 100), suffix: '%' },
      { name: 'filter_min_perf_gain', label: 'Performance', value: Math.round(adjustableSettings.filter_min_perf_gain * 100), suffix: '%' },
      { name: 'filter_max_loss_drop', label: 'Loss', value: adjustableSettings.filter_max_loss_drop, divideBy100: false, max: 1, step: 0.01 }]
      .map(({ name, value, label, min = 0, max = 100, step = 1, divideBy100 = true, suffix = '' }) =>
        <Grid key={name} item container direction='row' spacing={2} alignItems="center">
          <Grid item>
            <TextField
              value={`${value || 0}${suffix}`}
              className={classes.input}
              size="small"
              variant="outlined"
              label={label}/>
          </Grid>
          <Grid item xs>
            <Slider
              value={value}
              min={min}
              max={max}
              step={step}
              onChange={(e, value) =>
                dispatch(
                  changeModifierAdjustableSettings({
                    modifierId: modifier.modifier_id,
                    settings: { [name] : divideBy100 ? value / 100 : value }
                  })
                )}/>
          </Grid>
        </Grid>
      )}
  </Grid>
}

const LayersTableRow = ({ modifier, layer }) => {
  const classes = tableStyles()
  const dispatch = useDispatch()
  const layerSettings = useSelector(selectLayerAdjustableSettings(modifier.modifier_id, layer.node_id))

  return <TableRow key={layer.node_id} className={clsx(classes.row, { [classes.rowDisabled]: layerSettings.sparsity === null })}>
    <TableCell>
      <Typography>{layer.node_id}</Typography>
    </TableCell>
    <TableCell>
      <div className={classes.sparsityCell}>
        <Switch checked={layerSettings.sparsity !== null} color='primary'
          onChange={e => dispatch(changeLayerAdjustableSettings({
            modifierId: modifier.modifier_id,
            layerId: layer.node_id,
            settings: { sparsity: e.target.checked ? modifier.sparsity : null }
          }))}/>
        <Slider value={layerSettings.sparsity * 100} min={0} max={100}
          disabled={layerSettings.sparsity === null}
          onChange={(e, value) => dispatch(changeLayerAdjustableSettings({
            modifierId: modifier.modifier_id,
            layerId: layer.node_id,
            settings: { sparsity: Number(value) / 100 }
          }))}/>
        <Typography className={classes.sparsityValue}>{layerSettings.sparsity ? `${formatWithMantissa(1, layerSettings.sparsity * 100)}%` : ''}</Typography>
      </div>
    </TableCell>
    <TableCell>
      <Typography>{formatWithMantissa(3, layer.est_recovery)}</Typography>
    </TableCell>
    <TableCell>
      <Typography>{layer.est_perf_gain ? `${formatWithMantissa(1, layer.est_perf_gain)}x` : '--'}</Typography>
    </TableCell>
    <TableCell>
      <Typography>{formatWithMantissa(4, layer.est_time)}</Typography>
    </TableCell>
    <TableCell>
      <Typography>{formatWithMantissa(4, layer.est_time_baseline)}</Typography>
    </TableCell>
    <TableCell>
      <Typography>{formatWithMantissa(4, layer.est_loss_sensitivity)}</Typography>
    </TableCell>
    <TableCell>
      <Typography>{formatWithMantissa(4, layer.est_perf_sensitivity)}</Typography>
    </TableCell>
  </TableRow>
}

const LayersTable = ({ modifier }) => {
  const classes = tableStyles()
  const [searchTerm, setSearchTerm] = useState(null)

  const filteredLayers = compose(
    when(
      always(compose(not, isNil)(searchTerm)),
      filter(compose(contains(searchTerm), prop('node_id')))),
    defaultTo([]))(
    modifier.nodes)

  return (
    <TableContainer>
      <Table size='small'>
        <TableHead className={classes.header}>
          <TableRow>
            <TableCell>
              <TextField
                variant='outlined'
                label='Search Layers'
                size='small'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}/>
            </TableCell>
            <TableCell>
              <Typography>Sparsity Level %</Typography>
            </TableCell>
            <TableCell>
              <Typography>Recoverability Score</Typography>
            </TableCell>
            <TableCell>
              <Typography>Est. Speedup Factor</Typography>
            </TableCell>
            <TableCell>
              <Typography>Est. Current Time</Typography>
            </TableCell>
            <TableCell>
              <Typography>Est. Baseline Time</Typography>
            </TableCell>
            <TableCell>
              <Typography>Loss Sensitivity</Typography>
            </TableCell>
            <TableCell>
              <Typography>Perf. Sensitivity</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredLayers.map(layer => <LayersTableRow key={layer.node_id} modifier={modifier} layer={layer}/>)}
        </TableBody>
      </Table>
    </TableContainer>)
}

export default ({ modifier, optim, open, onClose }) => {
  const classes = useStyles()

  return <Dialog
    open={open}
    maxWidth="xl"
    onClose={onClose}>
    <DialogTitle>Pruning Editor</DialogTitle>
    <DialogContent>
      <Box marginY={2}>
        <IconButton className={classes.closeButton} onClick={onClose}><CloseIcon/></IconButton>
        <Grid container direction='row' spacing={6}>
          <Grid item xs={1}><SummaryMetrics modifier={modifier}/></Grid>
          <Grid item xs={3}><DetailedMetrics modifier={modifier}/></Grid>
          <Grid item xs={3}><Filters modifier={modifier}/></Grid>
          <Grid item xs={4}><PruningSettings modifier={modifier}/></Grid>
        </Grid>
        <LayersChart
          data={modifier.nodes}
          sparsityProp="sparsity"
          denseProp="est_time"
          sparseProp="est_time_baseline"/>
        <LayersTable modifier={modifier}/>
      </Box>
    </DialogContent>
  </Dialog>
}
