import { compose, reduce, concat, map, prop, always } from 'ramda'
import { useHistory } from '../common/router'
import { Component, fold, nothing, toContainer,
  useStyles, useSelector, fromClass } from '../common/component'
import { typography, iconButton } from '../common/materialui'
import { selectedProject } from '../store/selectors/projects'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  primaryText: {
    color: '#C2D1DB!important',
    fontSize: '14px!important'
  },
  secondaryText: {
    color: '#8E9AA2!important',
    fontSize: '12px!important'
  },
  backButton: {
    color: 'white',
    width: 15,
    height: 15
  },
  backIcon: {
    color: 'white'
  },
  projectName: {
    color: 'white'
  }
}

const backButton = Component(props => compose(
  fold(props),
  iconButton({ onClick: () => props.history.push('/') }))(
  fromClass(ArrowBackIosIcon).contramap(always({ className: props.classes.backIcon, size: 'small' }))))

const projectName = Component(props => compose(
  fold(props),
  typography({ className: prop('projectName') }),
  prop('projectName'))(
  props.selectedProject))

export default Component(props => compose(
  fold(props),
  useHistory,
  useStyles(styles),
  useSelector('selectedProject', selectedProject),
  map(toContainer({ className: prop('container') })),
  reduce(concat, nothing()))([
  backButton,
  projectName ]))
