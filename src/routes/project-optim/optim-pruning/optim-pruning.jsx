import React from "react"
import PropTypes from "prop-types"
import Paper from '@material-ui/core/Paper'

import AbsoluteLayout from "../../../components/absolute-layout"
import PruningModifier from '../pruning-modifier'

import makeStyles from "./optim-pruning-styles"

const useStyles = makeStyles()

const OptimPruning = ({ optim }) => {
  console.log('pruning optim', optim)
  const classes = useStyles()

  return <AbsoluteLayout spacingTop={4} spacingBottom={4} spacingRight={4} spacingLeft={4}>
    Pruning
    <Paper elevation={4}>
      {optim && optim.pruning_modifiers.map(modifier =>
          <PruningModifier modifier={modifier}/>)}
    </Paper>
  </AbsoluteLayout>
}

OptimPruning.propTypes = {
  optim: PropTypes.object.isRequired
}

export default OptimPruning
