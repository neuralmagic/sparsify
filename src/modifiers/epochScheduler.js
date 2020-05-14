import { compose, reduce, concat, map, prop, merge, uniqBy } from 'ramda'
import { Component, fold, nothing, useStyles, toContainer,
  fromElement, useSelector } from '../common/component'
import { vegaChart, epochSchedulerSpec } from '../common/charts'
import { allModifiersExpanded, selectedModifier } from '../store/selectors/modifiers'

const styles = {
  container: props => ({
    padding: 10,
    paddingLeft: 60,
    background: props.theme === 'dark' ? '#3C3E40' : '#EFF4FB',
    position: 'relative',
    boxShadow: props.theme === 'dark' ? '0px 2px 2px rgba(0, 0, 0, 0.349019607843137)' : ''
  }),
  title: props => ({
    position: 'absolute',
    marginLeft: -45,
    fontSize: 13,
    color: props.theme === 'dark' ? '#DFDFDF' : '#878D94'
  })
}

const chart = vegaChart.contramap(props => merge({
  width: 800,
  height: uniqBy(prop('id'), props.modifiers).length * 20,
  autosize: { type: 'fit', contains: 'padding', resize: true },
  spec: epochSchedulerSpec({
    backgroundColor: props.theme === 'dark' ? '#3C3E40' : '#EFF4FB',
    axesColor: props.theme === 'dark' ? 'gray' : '#BDC0C4',
    epochBackgroundGradient: props.theme === 'dark' ? ['#303234', '#303234'] : ['#D9DDE6', '#EDF0F4'],
    selectedEpochBackgroundGradient: props.theme === 'dark' ? ['black', 'black'] : ['#ADB4C5', '#EAEBF0'],
    labelColor: props.theme === 'dark' ? '#767C77' : '#878D94',
    data: props.modifiers,
    selectedModifier: props.selectedModifier
  }),
  title: props.title
}, props))

export default Component(props => compose(
  fold(props),
  useStyles(styles),
  useSelector('modifiers', allModifiersExpanded),
  useSelector('selectedModifier', selectedModifier),
  map(toContainer({ className: prop('container') })),
  reduce(concat, nothing()))([
    fromElement('span').contramap(props => merge(props, { children: 'Epoch', className: props.classes.title })),
    chart]))
