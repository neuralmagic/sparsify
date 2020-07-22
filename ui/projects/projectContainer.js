import { compose, reduce, concat, map, prop } from 'ramda'
import { onlyOnProjectOptimization } from '../routes'
import { Component, fold, toContainer, nothing,
  useStyles, useDispatch } from '../common/component'
import { button } from '../common/materialui'
import { exportCurrentProject } from '../store/actions/projects'
import pruningContainer from '../pruning/pruningContainer'

const styles = {
  container: props => ({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    paddingLeft: 320,
    paddingRight: 50,
    paddingTop: 40,
    background: props.theme === 'dark' ? '#151719' : '#F4F6F8'
  }),
  exportButton: {
    alignSelf: 'flex-end'
  }
}

const exportButton = button(props => ({
  variant: 'contained',
  size: 'large',
  className: prop('exportButton'),
  onClick: () => props.dispatch(exportCurrentProject())
}), 'Export')

export default Component(props => compose(
  fold(props),
  useStyles(styles),
  useDispatch,
  map(toContainer({ className: prop('container') })),
  reduce(concat, nothing()))([
  onlyOnProjectOptimization(pruningContainer),
  exportButton ]))
