import { compose, reduce, concat, map, prop } from 'ramda'
import { Component, fold, toContainer, nothing,
  useStyles } from '../common/component'
import profileSelector from '../profiles/selector'
import epochScheduler from '../modifiers/epochScheduler'
import modifiersList from '../modifiers/modifiersList'
import layerIndexChart from '../layers/indexChart'
import metricsList from '../metrics/metricsList'

const projectContainerStyles = {
  projectContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row'
  },
  mainContainer: props => ({
    flexGrow: 1,
    paddingLeft: 30,
    background: props.theme === 'dark' ? '#151719' : '#F8F9FA'
  }),
  sideContainer: props => ({
    width: 280,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    flexGrow: 0,
    borderRight: `1px solid ${props.theme === 'dark' ? '#4B4B4B' : '#C8CDD3'}`
  })
}

const layerControls = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('layerControls') })),
  reduce(concat, nothing()))([
  modifiersList ]))

const projectSideContent = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('sideContainer') })),
  reduce(concat, nothing()))([
  profileSelector,
  epochScheduler,
  metricsList ]))

export default Component(props => compose(
  fold(props),
  useStyles(projectContainerStyles),
  map(toContainer({ className: prop('projectContainer') })),
  concat(projectSideContent),
  map(toContainer({ className: prop('mainContainer') })),
  reduce(concat, nothing()))([
  layerControls,
  layerIndexChart ]))
