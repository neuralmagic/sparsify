import { compose, reduce, concat, map, prop, merge, objOf, when,
  equals, pathEq, always, not } from 'ramda'
import { format } from 'd3-format'
import { Component, fold, nothing, useStyles, toContainer,
  useSelector, fromElement, useState, branch } from '../common/component'
import { overallMetrics, metricsByType } from '../store/selectors/metrics'
import { image } from '../components'

const styles = {
  container: props => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingLeft: 10,
    background: props.theme === 'dark' ? '#262A2C' : '#F5F6F7'
  }),
  title: props => ({
    fontSize: 14,
    marginTop: 15,
    marginBottom: 15,
    color: props.theme === 'dark' ? 'white' : '#495057'
  }),
  list: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20
  },
  selectorContainer: {
    display: 'flex',
    flexDirection: 'row'
  }
}

const metricItemStyles = {
  container: props => ({
    display: 'flex',
    flexDirection: 'column',
    width: props.item.name === 'estimatedSpeedupFactor' ? 75 : 62,
    marginRight: 10,
    marginLeft: 10
  }),
  label: props => ({
    color: props.theme === 'dark' ? '#aaaaaa' : '#868e96',
    fontSize: 10,
    whiteSpace: 'pre-wrap'
  }),
  value: props => ({
    color: props.theme === 'dark' ? 'white' : '#495057',
    fontSize: 26,
    fontWeight: 300
  }),
  valueContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  speedupFactorImage: {
    minWidth: 18
  }
}

const selectorItemStyles = {
  container: props => ({
    display: 'flex',
    flexDirection: 'column',
    paddingTop: props.item.selected ? 0 : 5,
    marginBottom: 20,
    alignItems: 'center'
  }),
  span: props => ({
    fontSize: 9,
    background: props.item.selected ? props.theme === 'dark' ? '#133859' : 'rgba(146, 174, 206, 1)' : 'rgba(0, 0, 0, 0)',
    border: `1px solid ${props.theme === 'dark' ? '#133859' : 'rgba(146, 174, 206, 1)'}`,
    borderRadius: 2,
    textAlign: 'center',
    color: props.theme === 'dark' ? 'white' : props.item.selected ? '#495057' : '#868e96',
    padding: 2,
    margin: 2,
    width: 70
  }),
  arrowRight: props => ({
    width: 0,
    height: 0,
    borderLeft: '4px solid transparent',
    borderRight: '4px solid transparent',
    borderTop: `5px solid ${props.theme === 'dark' ? 'white' : '#868e96'}`
  })
}

const selectorItem = Component(props => compose(
  fold(props),
  useStyles(selectorItemStyles),
  map(toContainer({ className: prop('container') })),
  when(always(pathEq(['item', 'selected'], true, props)), concat(fromElement('div').contramap(merge({ className: prop('arrowRight') })))))(
  fromElement('span').contramap(merge({
    className: prop('span'),
    children: props.item.label,
    onClick: () => props.setSelectedType(props.item.type) }))))

const selector = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('selectorContainer') })),
  reduce(concat, nothing()),
  map(compose(
    selectorItem.contramap,
    merge,
    objOf('item'),
    when(compose(equals(props.selectedType), prop('type')), merge({ selected: true })))))([
  { label: 'Est. Time', type: 'time' },
  { label: 'Parameters', type: 'parameters' },
  { label: 'FLOPS', type: 'flops' }]))

const nothingIfNotSpeedFactor = branch(compose(not, pathEq(['item', 'name'], 'estimatedSpeedupFactor')), nothing())

const metricItem = Component(props => compose(
  fold(props),
  useStyles(metricItemStyles),
  map(toContainer({ className: prop('container') })),
  concat(fromElement('span').contramap(merge({ className: prop('label'), children: props.item.label }))),
  map(toContainer({ className: prop('valueContainer') })),
  reduce(concat, nothing()))([
  fromElement('span').contramap(merge({ className: prop('value'), children: format(props.item.format)(props.item.value) })),
  nothingIfNotSpeedFactor(fromElement('span').contramap(merge({ className: prop('value'), children: 'x' }))),
  nothingIfNotSpeedFactor(image.contramap(props => ({ className: props.classes.speedupFactorImage, src: 'assets/go_up.svg', width: 18, height: 22 })))]))

const overallList = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('list') })),
  reduce(concat, nothing()),
  map(compose(metricItem.contramap, merge, objOf('item'))))(
  props.overallMetrics))

const selectedMetricsList = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('list') })),
  reduce(concat, nothing()),
  map(compose(metricItem.contramap, merge, objOf('item'))))(
  props.metricsByType[props.selectedType]))

export default Component(props => compose(
  fold(props),
  useStyles(styles),
  useSelector('overallMetrics', overallMetrics),
  useSelector('metricsByType', metricsByType),
  useState('selectedType', 'setSelectedType', 'time'),
  map(toContainer({ className: prop('container') })),
  reduce(concat, nothing()))([
  fromElement('span').contramap(merge({ className: prop('title'), children: 'Baseline comparisons' })),
  selector,
  selectedMetricsList,
  overallList ]))
