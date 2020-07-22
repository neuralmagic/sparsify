import { compose, reduce, concat, map, prop } from 'ramda'
import { Component, fold, toContainer, nothing,
  useStyles, useDispatch } from '../common/component'
import { onlyOnProjectOptimization } from '../routes'
import pruningContainer from '../pruning/pruningContainer'

const styles = {
  container: props => ({
    flexGrow: 1,
    paddingLeft: 300,
    paddingTop: 40,
    background: props.theme === 'dark' ? '#151719' : '#F4F6F8'
  })
}

export default Component(props => compose(
  fold(props),
  useStyles(styles),
  useDispatch,
  map(toContainer({ className: prop('container') })),
  reduce(concat, nothing()))([
  onlyOnProjectOptimization(pruningContainer) ]))
