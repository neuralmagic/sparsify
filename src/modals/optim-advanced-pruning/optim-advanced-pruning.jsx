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
//import PruningSettings from './pruningSettings'

import makeStyles from "./optim-advanced-pruning-styles"

const useStyles = makeStyles()

const pruningSettingsStyles = makeStyles({
  root: {
    '& .MuiTextField-root': {
      width: 80
    }
  },
  title: {
    fontSize: 12,
    marginBottom: 20
  },
  rangeContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  }
})

const tableStyles = makeStyles({
  header: {
    '& .MuiTypography-root': {
      fontSize: 10,
      textTransform: 'uppercase'
    },
    backgroundColor: '#f4f4f8'
  },
  row: {
    '& .MuiTypography-root': {
      fontSize: 14
    },
    height: 40
  },
  rowDisabled: {
    opacity: 0.4
  },
  sparsityCell: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 170
  },
  sparsityValue: {
    marginLeft: 10
  }
})

const filtersStyles = makeStyles({
  presetTitle: {
    fontSize: 14,
    paddingTop: 20,
    paddingBottom: 20
  },
  presetSlider: {
    marginBottom: 20
  }
})

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

// const Filters = ({ modifier }) => {
//   const classes = filtersStyles()
//   const dispatch = useDispatch()

//   return [
//     inputWithSlider.fold({
//       label: 'Sparsity',
//       value: modifier.sparsity * 100,
//       onChange: value => dispatch(changeModifierSettings(modifier, { sparsity: value / 100 })) }),
//     <div><Typography className={classes.presetTitle}>Preset filters</Typography></div>,
//     inputWithSlider.fold({ label: 'Min Sparsity', value: 35, classes: { root: classes.presetSlider } }),
//     inputWithSlider.fold({ label: 'Performance', value: 35, classes: { root: classes.presetSlider } }),
//     inputWithSlider.fold({ label: 'Loss', value: 0.4, classes: { root: classes.presetSlider } })]
// }

const LayersTable = ({ modifier }) => {
  const classes = tableStyles()
  const [searchTerm, setSearchTerm] = useState(null)
  const dispatch = useDispatch()

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
          {filteredLayers.map(layer =>
            <TableRow key={layer.node_id} className={clsx(classes.row, { [classes.rowDisabled]: layer.sparsity === null })}>
              <TableCell>
                <Typography>{layer.node_id}</Typography>
              </TableCell>
              <TableCell>
                <div className={classes.sparsityCell}>
                  {/* <Switch checked={layer.sparsity !== null} color='primary'
                    onChange={e => dispatch(changeModifierLayerSettings(modifier, layer, {
                      sparsity: e.target.checked ? modifier.sparsity : null
                    }))}/>
                  <Slider value={layer.sparsity * 100} min={0} max={100}
                    disabled={layer.sparsity === null}
                    onChange={(e, value) => dispatch(changeModifierLayerSettings(modifier, layer, {
                      sparsity: Number(value) / 100
                    }))}/> */}
                  <Typography className={classes.sparsityValue}>{layer.sparsity ? `${formatWithMantissa(1, layer.sparsity * 100)}%` : ''}</Typography>
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
            </TableRow>)}
        </TableBody>
      </Table>
    </TableContainer>)
}

export default ({ modifier, open, onClose }) => {
  const classes = useStyles()

  return <Dialog
    open={open}
    maxWidth="xl"
    onClose={onClose}
    >
    <DialogTitle>Pruning Editor</DialogTitle>
    <DialogContent>
      <Box marginY={2}>
        <IconButton className={classes.closeButton} onClick={onClose}><CloseIcon/></IconButton>
        <Grid container direction='row' spacing={5}>
          <Grid item xs={1}><SummaryMetrics modifier={modifier}/></Grid>
          <Grid item xs={3}><DetailedMetrics modifier={modifier}/></Grid>
          {/* <Grid item xs={4}><Filters modifier={modifier}/></Grid> */}
          {/* <Grid item xs={4}><PruningSettings modifier={modifier}/></Grid> */}
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
