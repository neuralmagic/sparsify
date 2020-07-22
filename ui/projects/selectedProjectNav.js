import { compose, reduce, concat, prop } from 'ramda'
import { useHistory } from '../common/router'
import { Component, fold, nothing,
  useStyles, useSelector, fromClass } from '../common/component'
import { typography, listItem, useTheme } from '../common/materialui'
import { selectedProject } from '../store/selectors/projects'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

const styles = {
  backIcon: ({ theme }) => ({
    color: theme.menu.textColor,
    fontSize: '14px!important',
    paddingLeft: 8
  }),
  projectName: ({ theme }) => ({
    color: theme.menu.textColor
  })
}

const projectName = Component(props => compose(
  fold(props),
  typography({ className: prop('projectName') }),
  prop('projectName'))(
  props.selectedProject))

export default Component(props => compose(
  fold(props),
  useHistory,
  useTheme,
  useStyles(styles),
  useSelector('selectedProject', selectedProject),
  listItem(props => ({
    button: true,
    onClick: () => props.history.push('/') })),
  reduce(concat, nothing()))([
  fromClass(ArrowBackIosIcon).contramap(props => ({ className: props.classes.backIcon })),
  projectName ]))
