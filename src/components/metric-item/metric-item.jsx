import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import makeStyles from './metric-item-styles'

const useStyles = makeStyles()

const MetricItem = ({ label, value }) => {
  const classes = useStyles()

  return <Grid item className={classes.root}>
    <Typography className={classes.label}>{label}</Typography>
    <Typography className={classes.value}>{value}</Typography>
  </Grid>
}

MetricItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}

export default MetricItem
