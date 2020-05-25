import { compose, reduce, concat, map, prop, merge } from 'ramda'
import { Component, fold, nothing, useStyles, toContainer, useSelector } from '../common/component'
import { vegaChart, layerIndexChartSpec } from '../common/charts'
import { allModifiersExpanded, selectedModifier } from '../store/selectors/modifiers'

const styles = {
  container: props => ({
    padding: 10,
    paddingLeft: 60,
    background: props.theme === 'dark' ? '#1d2022' : '#f8f9fa',
    position: 'relative'
  }),
  title: props => ({
    position: 'absolute',
    marginLeft: -45,
    fontSize: 13,
    color: props.theme === 'dark' ? '#DFDFDF' : '#878D94'
  })
}

const data = [
  { layer: 1, sparsity: 130, denseExecTime: 10, sparseExecTime: 4 },
  { layer: 2, sparsity: 22, denseExecTime: 15, sparseExecTime: 3 },
  { layer: 3, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 4, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 5, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 6, sparsity: 30, denseExecTime: 34, sparseExecTime: 12 },
  { layer: 7, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 8, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 }]

const chart = vegaChart.contramap(props => merge({
  width: 1000,
  height: 380,
  autosize: { type: 'fit', contains: 'padding', resize: true },
  spec: layerIndexChartSpec({
    backgroundColor: props.theme === 'dark' ? '#1d2022' : '#f8f9fa',
    data,
  }),
  title: props.title
}, props))

export default Component(props => compose(
  fold(props),
  useStyles(styles),
  useSelector('modifiers', allModifiersExpanded),
  useSelector('selectedModifier', selectedModifier),
  map(toContainer({ className: prop('container') })),
  reduce(concat, nothing()))([
  chart]))
