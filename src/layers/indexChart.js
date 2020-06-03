import { compose, reduce, concat, map, prop, merge, always } from 'ramda'
import { Component, fold, nothing, useStyles, toContainer, useSelector, fromElement } from '../common/component'
import { vegaChart, layerIndexChartSpec } from '../common/charts'
import { allModifiersExpanded, selectedModifier } from '../store/selectors/modifiers'

const styles = {
  container: props => ({
    padding: 10,
    paddingLeft: 60,
    background: props.theme === 'dark' ? '#1d2022' : '#f8f9fa',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  }),
  title: props => ({
    position: 'absolute',
    marginLeft: -45,
    fontSize: 13,
    color: props.theme === 'dark' ? '#DFDFDF' : '#878D94'
  }),
  legend: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 57,
    width: 1127
  }
}

const legendItemStyles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#AAAAAA',
    fontSize: 10,
    marginRight: 15
  },
  sparsity: {
    width: 15,
    height: 3,
    marginRight: 4,
    background: '#E19425'
  },
  denseExecTime: {
    width: 15,
    height: 13,
    marginRight: 4,
    borderTop: '1px solid #92cafd',
    background: 'rgba(31, 120, 202, 0.5)',
  },
  sparseExecTime: {
    width: 15,
    height: 13,
    marginRight: 4,
    borderTop: '1px solid #6c86ff',
    background: 'rgba(1, 41, 110, 0.5)',
  }
}

const data = [
  { layer: 1, sparsity: 0, denseExecTime: 1.8024, sparseExecTime: 1.8224 },
  { layer: 2, sparsity: 59, denseExecTime: 0.3367, sparseExecTime: 0.2105 },
  { layer: 3, sparsity: 78, denseExecTime: 0.8317, sparseExecTime: 0.6819 },
  { layer: 4, sparsity: 72, denseExecTime: 1.891, sparseExecTime: 1.6854 },
  { layer: 5, sparsity: 65, denseExecTime: 2.2084, sparseExecTime: 1.6447 },
  { layer: 6, sparsity: 73, denseExecTime: 1.3811, sparseExecTime: 1.1288 },
  { layer: 7, sparsity: 76, denseExecTime: 0.9076, sparseExecTime: 0.762 },
  { layer: 8, sparsity: 75, denseExecTime: 1.8621, sparseExecTime: 1.4692 },
  { layer: 9, sparsity: 72, denseExecTime: 1.2963, sparseExecTime: 1.022 },
  { layer: 10, sparsity: 69, denseExecTime: 0.8066, sparseExecTime: 0.8909 },
  { layer: 11, sparsity: 79, denseExecTime: 1.8036, sparseExecTime: 1.4861 },
  { layer: 12, sparsity: 69, denseExecTime: 2.1647, sparseExecTime: 1.3215 },
  { layer: 13, sparsity: 82, denseExecTime: 2.0712, sparseExecTime: 0.8359 },
  { layer: 14, sparsity: 81, denseExecTime: 0.8588, sparseExecTime: 0.2435 },
  { layer: 15, sparsity: 87, denseExecTime: 3.077, sparseExecTime: 0.5516 },
  { layer: 16, sparsity: 91, denseExecTime: 1.07, sparseExecTime: 0.251 },
  { layer: 17, sparsity: 86, denseExecTime: 0.9027, sparseExecTime: 0.5806 },
  { layer: 18, sparsity: 87.7, denseExecTime: 1.035, sparseExecTime: 0.3491 },
  { layer: 19, sparsity: 82.9, denseExecTime: 1.0399, sparseExecTime: 0.3142 },
  { layer: 20, sparsity: 84.5, denseExecTime: 0.8256, sparseExecTime: 0.5915 },
  { layer: 21, sparsity: 79.8, denseExecTime: 1.0137, sparseExecTime: 0.3738 },
  { layer: 22, sparsity: 80, denseExecTime: 1.0523, sparseExecTime: 0.3459 },
  { layer: 23, sparsity: 81.4, denseExecTime: 0.8389, sparseExecTime: 0.6413 },
  { layer: 24, sparsity: 82.4, denseExecTime: 1.015, sparseExecTime: 0.36 },
  { layer: 25, sparsity: 73.7, denseExecTime: 1.9757, sparseExecTime: 0.6558 },
  { layer: 26, sparsity: 89.5, denseExecTime: 1.854, sparseExecTime: 0.6539 },
  { layer: 27, sparsity: 81.9, denseExecTime: 0.8006, sparseExecTime: 0.2561 },
  { layer: 28, sparsity: 91.9, denseExecTime: 2.1283, sparseExecTime: 0.3404 },
  { layer: 29, sparsity: 90.4, denseExecTime: 0.9463, sparseExecTime: 0.1957 },
  { layer: 30, sparsity: 91, denseExecTime: 1.443, sparseExecTime: 0.4042 },
  { layer: 31, sparsity: 84.8, denseExecTime: 0.8523, sparseExecTime: 0.2517 },
  { layer: 32, sparsity: 91.3, denseExecTime: 0.8748, sparseExecTime: 0.1941 },
  { layer: 33, sparsity: 91.2, denseExecTime: 1.484, sparseExecTime: 0.392 },
  { layer: 34, sparsity: 86.7, denseExecTime: 0.8459, sparseExecTime: 0.2235 },
  { layer: 35, sparsity: 88.6, denseExecTime: 0.875, sparseExecTime: 0.2285 },
  { layer: 36, sparsity: 90.8, denseExecTime: 0.2716, sparseExecTime: 0.4059 },
  { layer: 37, sparsity: 87, denseExecTime: 0.839, sparseExecTime: 0.2208 },
  { layer: 38, sparsity: 87.1, denseExecTime: 0.8484, sparseExecTime: 0.2331 },
  { layer: 39, sparsity: 90.6, denseExecTime: 0.2705, sparseExecTime: 0.408 },
  { layer: 40, sparsity: 86.6, denseExecTime: 0.8334, sparseExecTime: 0.2236 },
  { layer: 41, sparsity: 84.2, denseExecTime: 0.8585, sparseExecTime: 0.2635 },
  { layer: 42, sparsity: 89.6, denseExecTime: 0.2735, sparseExecTime: 0.4266 },
  { layer: 43, sparsity: 83.4, denseExecTime: 0.8407, sparseExecTime: 0.2547 },
  { layer: 44, sparsity: 77.1, denseExecTime: 1.7494, sparseExecTime: 0.6901 },
  { layer: 45, sparsity: 96.4, denseExecTime: 1.7359, sparseExecTime: 0.3837 },
  { layer: 46, sparsity: 93.4, denseExecTime: 0.3307, sparseExecTime: 0.6237 },
  { layer: 47, sparsity: 88.2, denseExecTime: 0.8699, sparseExecTime: 0.3507 },
  { layer: 48, sparsity: 87.8, denseExecTime: 1.0274, sparseExecTime: 0.3908 },
  { layer: 49, sparsity: 92.7, denseExecTime: 1.0288, sparseExecTime: 0.4243 },
  { layer: 50, sparsity: 87.6, denseExecTime: 0.8638, sparseExecTime: 0.3465 },
  { layer: 51, sparsity: 81.4, denseExecTime: 1.0068, sparseExecTime: 0.4782 },
  { layer: 52, sparsity: 94.8, denseExecTime: 1.6296, sparseExecTime: 0.3559 },
  { layer: 53, sparsity: 92.2, denseExecTime: 0.8581, sparseExecTime: 0.2671 },
  { layer: 54, sparsity: 0, denseExecTime: 0.2567, sparseExecTime: 0.2822 }]

const legendItem = Component(props => compose(
  fold(props),
  useStyles(legendItemStyles),
  map(toContainer({ className: prop('container') })),
  reduce(concat, nothing()))([
  fromElement('div').contramap(merge({ className: prop(props.type) })),
  fromElement('span').contramap(always({ children: props.label }))]))

const legend = Component(props => compose(
  fold(props),
  map(toContainer({ className: props.classes.legend })),
  reduce(concat, nothing()),
  map(compose(legendItem.contramap, merge)))(
  [
    { type: 'sparsity', label: 'Sparsity' },
    { type: 'denseExecTime', label: 'Dense Exec. Time' },
    { type: 'sparseExecTime', label: 'Sparse Exec. Time' },
  ]))

const chart = vegaChart.contramap(props => merge({
  width: 1000,
  height: 380,
  autosize: { type: 'fit', contains: 'padding', resize: true },
  spec: layerIndexChartSpec({
    backgroundColor: props.theme === 'dark' ? '#1d2022' : '#f8f9fa',
    axesColor: props.theme === 'dark' ? '#434649' : '#C8CDD3',
    gridColor: props.theme === 'dark' ? '#323437' : '#D7DADD',
    titleColor: props.theme === 'dark' ? 'white' : '#868E96',
    denseAreaColors: props.theme === 'dark' ? ['rgba(31, 120, 202, 1)', 'rgba(31, 120, 202, 0.4)'] : ['rgba(31, 120, 202, 1)', 'rgba(31, 120, 202, 0.4)'],
    sparseAreaColors: props.theme === 'dark' ? 'rgb(1, 41, 110)' : 'rgb(83, 153, 234)',
    sparseLineColor: props.theme === 'dark' ? '#6c86ff' : 'rgb(73, 145, 229)',
    denseLineColor: props.theme === 'dark' ? '#92cafd' : '#92cafd',
    labelColor: '#AAAAAA',
    data,
  }),
  title: props.title,
  signalListeners: {
    tooltip: (name, { layer, sparsity, denseExecTime, sparseExecTime }) =>
      alert(`Layer ${layer}; Sparsity: ${sparsity}; Dense Execution Time: ${denseExecTime}; Sparse Execution Time: ${sparseExecTime}`)
  }
}, props))

export default Component(props => compose(
  fold(props),
  useStyles(styles),
  useSelector('modifiers', allModifiersExpanded),
  useSelector('selectedModifier', selectedModifier),
  map(toContainer({ className: prop('container') })),
  reduce(concat, nothing()))([
  chart,
  legend]))
