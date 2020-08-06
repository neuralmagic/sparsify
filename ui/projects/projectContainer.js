import { compose, reduce, concat, map, prop } from 'ramda'
import { onlyOnProjectOptimization } from '../routes'
import { Component, fold, toContainer, nothing,
  useStyles, useDispatch } from '../common/component'
import { button, useTheme } from '../common/materialui'
import { exportCurrentProject } from '../store/actions/projects'
import pruningContainer from '../pruning/pruningContainer'
import { exportIcon } from '../common/icons'

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
    color: 'white!important',
    height: '50px!important',
    textTransform: 'none!important',
    fontSize: '1.1rem!important',
    '& svg': {
      marginBottom: '5px'
    }
  }
}

const exportButton = button(props => ({
  variant: 'contained',
  color: 'secondary',
  size: 'large',
  classes: { root: props.classes.exportButton },
  startIcon: exportIcon.fold({}),
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
