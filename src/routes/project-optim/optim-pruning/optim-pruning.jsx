import React from "react"
import PropTypes from "prop-types"
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import AbsoluteLayout from "../../../components/absolute-layout"
import PruningModifier from '../pruning-modifier'

import makeStyles from "./optim-pruning-styles"

const useStyles = makeStyles()

const OptimPruning = ({ optim }) => {
  const classes = useStyles()

  return <AbsoluteLayout spacingTop={4} spacingBottom={4} spacingRight={4} spacingLeft={4}>
    <Typography variant="h6">Pruning</Typography>
    <Paper elevation={4} className={classes.root}>
      {optim && optim.pruning_modifiers.map(modifier =>
        <PruningModifier key={modifier.modifier_id} modifier={modifier} optim={optim}/>)}
    </Paper>
  </AbsoluteLayout>
}

OptimPruning.propTypes = {
  optim: PropTypes.object.isRequired
}

export default OptimPruning
