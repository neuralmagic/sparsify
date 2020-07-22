import { compose, reduce, concat, map, merge, prop, objOf, defaultTo } from 'ramda'
import { Component, fold, nothing,
  useStyles, useSelector, useDispatch } from '../common/component'
import { list, listItem, listItemText } from '../common/materialui'
import { allProjects } from '../store/selectors/projects'
import { selectProject } from '../store/actions/projects'

const itemStyles = {
  primaryText: {
    color: '#C2D1DB!important',
    fontSize: '14px!important'
  },
  secondaryText: {
    color: '#8E9AA2!important',
    fontSize: '12px!important'
  }
}

const projectItem = Component(props => compose(
  fold(props),
  useStyles(itemStyles),
  listItem({
    button: true,
    onClick: () => props.dispatch(selectProject(props.project.projectId)),
    className: prop('listItem') }))(
  listItemText.contramap(props => ({
    classes: {
      primary: props.classes.primaryText,
      secondary: props.classes.secondaryText
    },
    primary: props.project.projectName || props.project.projectId,
    secondary: '1 hour ago'
  }))))

const projectList = Component(props => compose(
  fold(props),
  list({}),
  reduce(concat, nothing()),
  map(compose(projectItem.contramap, merge, objOf('project'))),
  defaultTo([]))(
  props.projects))

export default Component(props => compose(
  fold(props),
  useDispatch,
  useSelector('projects', allProjects))(
  projectList))
