import { compose, reduce, concat, map, prop, merge, uniqBy } from 'ramda'
import { Vega } from 'react-vega'
import { Component, fold, nothing, useStyles, toContainer,
  fromElement, useSelector, fromClass } from '../common/component'
import { epochSchedulerChartSpec } from '../common/charts'
import { allModifiersExpanded, selectedModifier } from '../store/selectors/modifiers'

const styles = {
  container: props => ({
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 15,
    paddingTop: 20,
    background: props.theme === 'dark' ? '#2C2F31' : 'rgba(228, 234, 240, 1)',
  }),
  title: props => ({
    fontSize: 14,
    marginBottom: 5,
    color: props.theme === 'dark' ? 'white' : '#495057'
  })
}

const chart = fromClass(Vega).contramap(props => merge({
  width: 210,
  height: uniqBy(prop('id'), props.modifiers).length * 20,
  autosize: { type: 'fit', contains: 'padding', resize: true },
  spec: epochSchedulerChartSpec({
    backgroundColor: props.theme === 'dark' ? '#2C2F31' : 'rgba(228, 234, 240, 1)',
    axesColor: props.theme === 'dark' ? 'gray' : '#BDC0C4',
    epochBackgroundGradient: props.theme === 'dark' ? ['#222324', '#222324'] : ['#D9DDE6', '#EDF0F4'],
    selectedEpochBackgroundGradient: props.theme === 'dark' ? ['black', 'black'] : ['#ADB4C5', '#EAEBF0'],
    labelColor: props.theme === 'dark' ? 'rgba(255, 255, 255, 0.419607843137255)' : '#878D94',
    data: props.modifiers,
    selectedModifier: props.selectedModifier
  }),
}, props))

export default Component(props => compose(
  fold(props),
  useStyles(styles),
  useSelector('modifiers', allModifiersExpanded),
  useSelector('selectedModifier', selectedModifier),
  map(toContainer({ className: prop('container') })),
  reduce(concat, nothing()))([
  fromElement('span').contramap(merge({ children: 'Epoch schedule', className: prop('title') })),
  chart]))
