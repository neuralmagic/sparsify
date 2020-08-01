import { compose, reduce, concat, map, prop, merge, objOf,
  pathEq, not } from 'ramda'
import { Component, fold, nothing, useStyles, toContainer,
  useSelector, fromElement, branch } from '../common/component'
import { metrics } from '../store/selectors/pruning'

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingRight: 20,
    maxWidth: 200,
    flexGrow: 0
  },
  list: {
    display: 'flex',
    flexDirection: 'column'
  }
}

const metricItemStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 25,
    marginRight: 20
  },
  label: {
    color: '#868e96',
    fontSize: 10,
    whiteSpace: 'pre-wrap'
  },
  value: {
    color: '#495057',
    fontSize: 26,
    fontWeight: 300
  },
  valueContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10
  }
}

const nothingIfNotSpeedFactor = branch(compose(not, pathEq(['item', 'name'], 'estimatedSpeedupFactor')), nothing())

const metricItem = Component(props => compose(
  fold(props),
  useStyles(metricItemStyles),
  map(toContainer({ className: prop('container') })),
  concat(fromElement('span').contramap(props => ({ className: props.classes.label, children: props.item.label }))),
  map(toContainer({ className: prop('valueContainer') })),
  reduce(concat, nothing()))([
  fromElement('span').contramap(props => ({ className: props.classes.value, children: props.item.value })),
  nothingIfNotSpeedFactor(fromElement('span').contramap(props => ({ className: props.classes.value, children: 'x' })))]))

const list = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('list') })),
  reduce(concat, nothing()),
  map(compose(metricItem.contramap, merge, objOf('item'))))(
  props.metrics))

export default Component(props => compose(
  fold(props),
  useStyles(styles),
  useSelector('metrics', metrics),
  map(toContainer({ className: classes => `${classes.root} ${props.classes.root}` })))(
  list))
