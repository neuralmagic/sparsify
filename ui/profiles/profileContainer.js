import React from 'react'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { useSelector, useDispatch } from 'react-redux'
import { selectedProfile } from '../store/selectors/profiles'
import { navigateToProjectSection } from '../store/actions/navigation'

const useStyles = makeStyles({
  container: {
    padding: 40
  },
  title: {
    marginBottom: 10,
  },
  summary: {
    fontSize: 14,
    whiteSpace: 'initial'
  },
  button: {
    color: 'white',
    width: '100%',
    marginTop: 25,
    height: 50,
    textTransform: 'none'
  }
})

const useMetricItemStyles = makeStyles({
  root: {
    padding: 10
  },
  label: {
    fontSize: 14,
    color: '#777777'
  },
  value: props => ({
    fontSize: props.valueSize || 18
  })
})

const MetricItem = ({ label, value, valueSize }) => {
  const classes = useMetricItemStyles({ valueSize })

  return (
    <div className={classes.root}>
      <Typography className={classes.label}>{label}</Typography>
      <Typography className={classes.value}>{value}</Typography>
    </div>
  )
}

export default () => {
  const classes = useStyles()
  const profile = useSelector(selectedProfile)
  const dispatch = useDispatch()

  return (
    <div>
      <Typography variant='h5' className={classes.title}>
        Performance Profile
      </Typography>
      <Paper elevation={4} className={classes.container}>
        <Typography variant='h6' className={classes.title}>
          {profile.name}
        </Typography>
        <Grid container direction='row'>
          <Grid item container direction='column' xs>
            <MetricItem label='Model' value={profile.model}/>
            <Grid container direction='row'>
              <MetricItem label='Batch size' value={profile.batchSize}/>
              <MetricItem label='Core count' value={profile.cores}/>
              <MetricItem label='Instruction set' value={profile.instructionSet}/>
            </Grid>
          </Grid>
          <Grid item container direction='column' xs>
            <Grid item container direction='row'>
              <MetricItem label='MS per item' value={24.21} valueSize={26}/>
              <MetricItem label='MS per batch' value={16.22} valueSize={26}/>
            </Grid>
            <Grid item container direction='row'>
              <MetricItem label='Items per second' value={40.1} valueSize={26}/>
              <MetricItem label='Estimated speedup' value='12.6x' valueSize={26}/>
            </Grid>
          </Grid>
          <Grid item container xs>
            <Typography className={classes.summary}>
              Optimize, retrain and utilize Neural Magic's runtime engine to achieve faster inference timings.
            </Typography>
            <Typography className={classes.summary}>
              A estimated 12.6x gain could be achieved by optimizing.
            </Typography>
            <Button onClick={() => dispatch(navigateToProjectSection('optimization'))}
              color='secondary'
              variant='contained'
              size='large'
              className={classes.button}>
              Start Optimizing
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}
