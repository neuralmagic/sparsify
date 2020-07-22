import { compose, reduce, concat, prop } from 'ramda'
import { Component, fold, nothing, useStyles } from '../common/component'
import layersChart from './layersChart'
import sparsitySettings from './sparsitySettings'
import { paper, typography } from '../common/materialui'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    marginBottom: '10px!important'
  },
  paper: {
    padding: '20px',
    display: 'flex'
  }
}

const settings = Component(props => compose(
  fold(props))(
  sparsitySettings))

export default Component(props => compose(
  fold(props),
  useStyles(styles),
  concat(typography({ variant: 'h5', className: prop('title') }, 'Pruning')),
  paper({ elevation: 1, className: prop('paper') }),
  reduce(concat, nothing()))([
  layersChart,
  settings ]))
