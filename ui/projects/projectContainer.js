import { compose, reduce, concat, map, prop } from 'ramda'
import { onlyOnProjectOptimization } from '../routes'
import { Component, fold, toContainer, nothing,
  useStyles, useDispatch, fromClass } from '../common/component'
import { button, useTheme } from '../common/materialui'
import { exportCurrentProject } from '../store/actions/projects'
import pruningContainer from '../pruning/pruningContainer'
import PublishIcon from '@material-ui/icons/Publish'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    paddingLeft: 320,
    paddingRight: 50,
    paddingTop: 40,
    background: props.theme.background
  }),
  exportButton: {
    alignSelf: 'flex-end',
    borderRadius: '30px!important',
    color: 'white!important'
  }
}

const exportButton = button(props => ({
  variant: 'contained',
  color: 'primary',
  size: 'large',
  classes: { root: props.classes.exportButton },
  startIcon: fromClass(PublishIcon).fold({}),
  onClick: () => props.dispatch(exportCurrentProject())
}), 'Export')

export default Component(props => compose(
  fold(props),
  useTheme,
  useStyles(styles),
  useDispatch,
  map(toContainer({ className: prop('container') })),
  reduce(concat, nothing()))([
  onlyOnProjectOptimization(pruningContainer),
  onlyOnProjectOptimization(exportButton) ]))
