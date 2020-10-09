import { compose, filter, contains, prop, defaultTo, sortBy,
  when, always, not, isNil, toPairs, map, objOf, of as rof,
  head, last, __ } from 'ramda'
import React, { useState } from 'react'
import clsx from 'clsx'
import { ResponsiveLine } from "@nivo/line"
import { useSelector, useDispatch } from 'react-redux'
import { Typography, IconButton, Grid, TextField, Table, TableBody, Dialog, DialogTitle,
  TableCell, TableContainer, TableHead, TableRow, Switch, Slider, DialogContent, Box,
  Collapse } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import LayersChart from '../../components/layers-chart'
import MetricItem from '../../components/metric-item'
import { formatWithMantissa } from '../../components'
import PruningSettings from '../../components/pruning-settings'

import makeStyles, { makeTableStyles, makeFiltersStyles, makeTableRowStyles } from "./optim-advanced-pruning-styles"
import {
  selectModifierAdjustableSettings,
  changeModifierAdjustableSettings,
  changeLayerAdjustableSettings,
  selectLayerAdjustableSettings,
  selectSelectedProjectPrunableNodesById,
} from "../../store";

import { readableNumber } from "../../components";

const useStyles = makeStyles()
const tableStyles = makeTableStyles()
const tableRowStyles = makeTableRowStyles()
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
    <Grid item><Typography>Preset filters</Typography></Grid>
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

const LayerMeasurementsChart = ({ data }) => (
  <ResponsiveLine
      data={data}
      margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', min: 'auto', max: 'auto', reverse: false }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        tickValues: [head(data[0].data).x, last(data[0].data).x]
      }}
      axisLeft={null}
      enableGridX={false}
      colors={['#86C368']}
      enablePoints={false}
      enableArea={true}
      useMesh={true}
      enableCrosshair={false}
      areaOpacity={0.3}
      isInteractive={true}
      enableCrosshair={false}
      animate={false}/>)

const LayersTableRow = ({ modifier, layer, data }) => {
  const classes = tableRowStyles()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const layerSettings = useSelector(selectLayerAdjustableSettings(modifier.modifier_id, layer.node_id))

  const asChartData = compose(
    rof,
    objOf('data'),
    sortBy(prop('x')),
    map(values => ({ x: values[0], y: defaultTo(0, values[1]) })),
    toPairs)

  const SectionText = ({ children }) => <Grid item className={classes.layerDetailsSectionText}>{children}</Grid>

  return <React.Fragment>
    <TableRow key={layer.node_id} className={clsx(classes.root, { [classes.disabled]: layerSettings.sparsity === null })}>
      <TableCell style={{ padding: 0 }}>
        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </TableCell>
      <TableCell style={{ paddingLeft: 0}}>
        <Typography>{data.index + 1}. {data.weight_name}</Typography>
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
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }}/>
      <TableCell style={{ padding: 0 }} colSpan={8}>
        <Collapse in={open} unmountOnExit>
          <Grid container direction="row" className={classes.layerDetails}>
            <Grid item direction="column" className={classes.layerDetailsSection}>
              <Grid item className={classes.layerDetailsSectionHeader}>Measures</Grid>
              <Grid item>
                <Grid container direction="row" spacing={2}>
                  <Grid item direction="column">
                    <SectionText>Current parameters</SectionText>
                    <SectionText>Baseline parameters</SectionText>
                    <SectionText>Current FLOPS</SectionText>
                    <SectionText>Baseline FLOPS</SectionText>
                  </Grid>
                  <Grid item direction="column">
                    <Grid item>{readableNumber(layer.params)}</Grid>
                    <Grid item>{readableNumber(layer.params_baseline)}</Grid>
                    <Grid item>{readableNumber(layer.flops)}</Grid>
                    <Grid item>{readableNumber(layer.flops_baseline)}</Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item direction="column" className={classes.layerDetailsSection}>
              <Grid item className={classes.layerDetailsSectionHeader}>Layer attributes</Grid>
              <Grid item>
                <Grid container direction="row" spacing={2}>
                  <Grid item direction="column">
                    <SectionText>Type</SectionText>
                    <SectionText>Dilations</SectionText>
                    <SectionText>Group</SectionText>
                    <SectionText>Kernel_shape</SectionText>
                  </Grid>
                  <Grid item direction="column">
                    <Grid item>{data.op_type}</Grid>
                    <Grid item>{data.attributes.dilations?.join(', ')}</Grid>
                    <Grid item>{data.attributes.group}</Grid>
                    <Grid item>{data.attributes.kernel_shape?.join(', ')}</Grid>
                  </Grid>
                  <Grid item direction="column">
                    <SectionText>Pads</SectionText>
                    <SectionText>Strides</SectionText>
                  </Grid>
                  <Grid item direction="column">
                    <Grid item>{data.attributes.pads?.join(', ')}</Grid>
                    <Grid item>{data.attributes.strides?.join(', ')}</Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item direction="column" className={classes.layerDetailsSection}>
              <Grid item>Recoverability vs Sparsity</Grid>
              <Grid item>
                <div className={classes.chart}>
                  <LayerMeasurementsChart data={asChartData(data.measurements.loss)}/>
                </div>
              </Grid>
            </Grid>
            <Grid item direction="column" className={classes.layerDetailsSection}>
              <Grid item>Performance density</Grid>
              <Grid item>
                <div className={classes.chart}>
                  <LayerMeasurementsChart data={asChartData(data.measurements.perf)}/>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Collapse>
      </TableCell>
    </TableRow>
  </React.Fragment>
}

const LayersTable = ({ modifier, layerData }) => {
  const classes = tableStyles()
  const [searchTerm, setSearchTerm] = useState(null)

  const filteredLayers = compose(
    when(
      always(compose(not, isNil)(searchTerm)),
      filter(compose(
        contains(searchTerm),
        prop("weight_name"),
        prop(__, layerData),
        prop('node_id')))),
    defaultTo([]))(
    modifier.nodes)

  return (
    <TableContainer>
      <Table size='small'>
        <TableHead className={classes.header}>
          <TableRow>
            <TableCell size="small" style={{ padding: 0 }}>
            </TableCell>
            <TableCell style={{ paddingLeft: 0 }}>
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
          {filteredLayers.map(layer => <LayersTableRow key={layer.node_id} modifier={modifier} layer={layer} data={layerData[layer.node_id]}/>)}
        </TableBody>
      </Table>
    </TableContainer>)
}

export default ({ modifier, open, onClose }) => {
  const classes = useStyles()
  const layerData = useSelector(selectSelectedProjectPrunableNodesById)

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
          layerData={layerData}
          sparsityProp="sparsity"
          denseProp="est_time"
          sparseProp="est_time_baseline"/>
        <LayersTable modifier={modifier} layerData={layerData}/>
      </Box>
    </DialogContent>
  </Dialog>
}
