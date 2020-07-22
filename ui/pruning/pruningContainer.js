import { compose, reduce, concat, prop, map, merge, objOf, always } from 'ramda'
import { Component, fold, nothing, useStyles, toContainer, useSelector } from '../common/component'
import layersChart from './layersChart'
import sparsitySlider from './sparsitySlider'
import metricsList from './metricsList'
import { paper, typography, divider } from '../common/materialui'
import { pruningModifiers } from '../store/selectors/pruning'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 100
  },
  title: {
    marginBottom: '10px!important'
  },
  paper: {
    padding: '20px',
    display: 'flex'
  },
  modifiersContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 20
  },
  modifierContainer: {
    display: 'flex',
    flexDirection: 'row'
  }
}

const modifierChart = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('modifierContainer') })),
  reduce(concat, nothing()))([
  layersChart,
  sparsitySlider]))

const modifierContainers = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('modifiersContainer') })),
  reduce(concat, nothing()),
  map(compose(modifierChart.contramap, merge, objOf('modifier'))))(
  props.modifiers))

export default Component(props => compose(
  fold(props),
  useStyles(styles),
  useSelector('modifiers', pruningModifiers),
  map(toContainer({ className: prop('container') })),
  concat(typography({ variant: 'h5', className: prop('title') }, 'Pruning')),
  paper({ elevation: 1, className: prop('paper') }),
  reduce(concat, nothing()))([
  metricsList,
  divider.contramap(always({ orientation: 'vertical', flexItem: true })),
  modifierContainers]))
