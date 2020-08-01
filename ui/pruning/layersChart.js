import { compose, reduce, concat, map, prop, merge, objOf, zipWith, addIndex, tap } from 'ramda'
import { Vega } from 'react-vega'
import { Component, fold, nothing, useStyles, toContainer, useSelector, fromElement, fromClass } from '../common/component'
import { layerIndexChartSpec } from '../common/charts'
import { sparsity, denseExecutionTimeData, sparseExecutionTimeData } from '../store/selectors/pruning'

const mapIndexed = addIndex(map)

const styles = {
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  },
  legend: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 20,
  }
}

const legendItemStyles = {
  root: {
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
    borderTop: '2px solid #92cafd',
    background: 'rgba(31, 120, 202, 0.5)',
  },
  sparseExecTime: {
    width: 15,
    height: 13,
    marginRight: 4,
    borderTop: '2px solid #6c86ff',
    background: 'rgba(1, 41, 110, 0.5)',
  }
}

const computeChartData = ({ denseExecutionTimeData, sparseExecutionTimeData, sparsity }) => {
  const sparsityData = map(objOf('sparsity'), sparsity)
  const denseData = map(objOf('denseExecTime'), denseExecutionTimeData)
  const sparseData = map(objOf('sparseExecTime'), sparseExecutionTimeData)

  const chartData = compose(
    mapIndexed((v, index) => merge(v, { layer: index + 1 })),
    zipWith(merge, sparsityData),
    zipWith(merge, denseData))(
    sparseData)

  return chartData
}

const legendItem = Component(props => compose(
  fold(props),
  useStyles(legendItemStyles),
  map(toContainer({ className: prop('root') })),
  reduce(concat, nothing()))([
  fromElement('div').contramap(props => ({ className: props.classes[props.type] })),
  fromElement('span').contramap(props => ({ children: props.label }))]))

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

const chart = fromClass(Vega).contramap(props => merge({
  //width: 600,
  height: 200,
  spec: layerIndexChartSpec({
    backgroundColor: 'white',
    axesColor: '#434649',
    gridColor: '#F4F6F8',
    titleColor: '#868E96',
    denseAreaColors: ['rgba(31, 120, 202, 1)', 'rgba(31, 120, 202, 0.4)'],
    sparseAreaColors: 'rgb(1, 41, 110)',
    sparseLineColor: '#6c86ff',
    denseLineColor: '#92cafd',
    labelColor: '#AAAAAA',
    data: computeChartData(props),
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
  useSelector('sparsity', sparsity(props.modifier)),
  useSelector('denseExecutionTimeData', denseExecutionTimeData),
  useSelector('sparseExecutionTimeData', sparseExecutionTimeData(props.modifier)),
  map(toContainer({ className: classes => `${classes.root} ${props.classes.root}` })),
  reduce(concat, nothing()))([
  chart,
  legend]))
