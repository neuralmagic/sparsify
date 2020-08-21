import { compose, filter, contains, prop, defaultTo, when, always, not, isNil } from 'ramda'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import inputWithSlider from '../common/components/inputWithSlider'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { perfData } from '../store/selectors/pruning'
import Switch from '@material-ui/core/Switch'
import Slider from '@material-ui/core/Slider'
import layersChart from './layersChart'
import { changeSparsity } from '../store/actions/pruning'

const styles = makeStyles({
  paper: {
    position: 'absolute',
    top: 20,
    maxWidth: 1200,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    marginBottom: 20
  },
  title: {
    marginBottom: 50
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15
  },
  layersChartContainer: {
    flexGrow: 1,
    marginTop: 20,
    marginBottom: 20
  },
})

const metricItemStyles = makeStyles(theme => ({
  root: {
    marginBottom: 15
  },
  label: {
    fontSize: 10,
    color: theme.palette.text.secondary
  },
  value: {
    fontSize: 26
  }
}))

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

const MetricItem = ({ label, value }) => {
  const classes = metricItemStyles()

  return <Grid item className={classes.root}>
    <Typography className={classes.label}>{label}</Typography>
    <Typography className={classes.value}>{value}</Typography>
  </Grid>
}

const SummaryMetrics = () =>
  <Grid container direction='column'>
    {[{ label: 'Est. Speedup', value: '12.64x' },
      { label: 'Est. Time', value: '5.46' },
      { label: 'Recoverability', value: '0.0954' },
      { label: 'Total Sparsity', value: '65%' }].map(MetricItem)}
  </Grid>

const DetailedMetrics = () =>
  <Grid container direction='row' spacing={3} justify='flex-end'>
    <Grid item direction='column'>
      {[{ label: 'Est. Baseline Time', value: '0.981' },
        { label: 'Baseline Parameters', value: '0.981' },
        { label: 'Baseline FLOPS', value: '0.981' }].map(MetricItem)}
    </Grid>
    <Grid item direction='column'>
      {[{ label: 'Est. Current Time', value: '0.003' },
        { label: 'Current Parameters', value: '0.003' },
        { label: 'Current FLOPS', value: '0.003' }].map(MetricItem)}
    </Grid>
  </Grid>

const Filters = ({ modifier }) => {
  const classes = filtersStyles()
  const dispatch = useDispatch()

  return [
    inputWithSlider.fold({
      label: 'Sparsity',
      value: modifier.sparsity * 100,
      onChange: value => dispatch(changeSparsity(value / 100, modifier)) }),
    <div><Typography className={classes.presetTitle}>Preset filters</Typography></div>,
    inputWithSlider.fold({ label: 'Min Sparsity', value: 35, classes: { root: classes.presetSlider } }),
    inputWithSlider.fold({ label: 'Performance', value: 35, classes: { root: classes.presetSlider } }),
    inputWithSlider.fold({ label: 'Loss', value: 0.4, classes: { root: classes.presetSlider } })]
}

const PruningSettings = () => {
  const classes = pruningSettingsStyles()

  return <div className={classes.root}>
    <Typography className={classes.title}>Pruning range</Typography>
    <Grid container direction='column' spacing={3}>
      <Grid item direction='row' spacing={3} className={classes.rangeContainer}>
        <TextField variant='outlined' size='small' label='Start' value={0}></TextField>
        <TextField variant='outlined' size='small' label='End' value={95}></TextField>
        <TextField variant='outlined' size='small' label='Update' value={0.02}></TextField>
      </Grid>
      <Grid container direction='row'>
        <TextField variant='outlined' size='small' label='Recovery' value={0.5}></TextField>
        <Slider defaultValue={1} min={0} max={2} step={1} width={50}></Slider>
      </Grid>
    </Grid>
  </div>
}

const LayersTable = () => {
  const classes = tableStyles()
  const [searchTerm, setSearchTerm] = useState(null)
  const sparseData = useSelector(perfData)

  const filteredLayers = compose(
    when(
      always(compose(not, isNil)(searchTerm)),
      filter(compose(contains(searchTerm), prop('name')))),
    defaultTo([]))(
    sparseData)

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
            <TableRow key={layer.name} className={classes.row}>
              <TableCell>
                <Typography>{layer.name}</Typography>
              </TableCell>
              <TableCell>
                <div className={classes.sparsityCell}>
                  <Switch defaultChecked color='primary'/>
                  <Slider/>
                  <Typography className={classes.sparsityValue}>59%</Typography>
                </div>
              </TableCell>
              <TableCell>
                <Typography>0.712</Typography>
              </TableCell>
              <TableCell>
                <Typography>1.4x</Typography>
              </TableCell>
              <TableCell>
                <Typography>0.102</Typography>
              </TableCell>
              <TableCell>
                <Typography>0.048</Typography>
              </TableCell>
              <TableCell>
                <Typography>High (0.94)</Typography>
              </TableCell>
              <TableCell>
                <Typography>Medium (0.53)</Typography>
              </TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
    </TableContainer>)
}

export default ({ modifier, onClose }) => {
  const classes = styles()

  return <Paper elevation={4} className={classes.paper}>
    <Typography className={classes.title} variant='h6'>Pruning Editor</Typography>
    <IconButton className={classes.closeButton} onClick={onClose}><CloseIcon/></IconButton>
    <Grid container direction='row' spacing={5}>
      <Grid item xs={1}><SummaryMetrics/></Grid>
      <Grid item xs={3}><DetailedMetrics/></Grid>
      <Grid item xs={4}><Filters modifier={modifier}/></Grid>
      <Grid item xs={4}><PruningSettings/></Grid>
    </Grid>
    {layersChart.fold({ modifier, classes: { root: classes.layersChartContainer }, height: 400 })}
    <LayersTable modifier={modifier}/>
  </Paper>
}
