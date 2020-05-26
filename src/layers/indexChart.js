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
  { layer: 8, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 9, sparsity: 130, denseExecTime: 10, sparseExecTime: 4 },
  { layer: 10, sparsity: 22, denseExecTime: 15, sparseExecTime: 3 },
  { layer: 11, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 12, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 13, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 14, sparsity: 30, denseExecTime: 34, sparseExecTime: 12 },
  { layer: 15, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 16, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 17, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 18, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 19, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 20, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 21, sparsity: 30, denseExecTime: 34, sparseExecTime: 12 },
  { layer: 22, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 23, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 24, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 25, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 26, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 27, sparsity: 30, denseExecTime: 34, sparseExecTime: 12 },
  { layer: 28, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 29, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 30, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 31, sparsity: 22, denseExecTime: 15, sparseExecTime: 3 },
  { layer: 32, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 33, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 34, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 35, sparsity: 30, denseExecTime: 34, sparseExecTime: 12 },
  { layer: 36, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 37, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 38, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 39, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 40, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 41, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 42, sparsity: 30, denseExecTime: 34, sparseExecTime: 12 },
  { layer: 43, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 44, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 45, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 46, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 47, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 48, sparsity: 30, denseExecTime: 34, sparseExecTime: 12 },
  { layer: 49, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 50, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 },
  { layer: 51, sparsity: 30, denseExecTime: 18, sparseExecTime: 12 }]

const chart = vegaChart.contramap(props => merge({
  width: 1000,
  height: 380,
  autosize: { type: 'fit', contains: 'padding', resize: true },
  spec: layerIndexChartSpec({
    backgroundColor: props.theme === 'dark' ? '#1d2022' : '#f8f9fa',
    axesColor: props.theme === 'dark' ? '#434649' : '#C8CDD3',
    gridColor: props.theme === 'dark' ? '#323437' : '#D5D7DA',
    titleColor: props.theme === 'dark' ? 'white' : '#868E96',
    labelColor: '#AAAAAA',
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
