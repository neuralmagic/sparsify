import { compose, reduce, concat, prop, map, merge, mergeDeepLeft, objOf, always } from 'ramda'
import React from 'react'
import { Component, fold, nothing, useStyles, toContainer, useSelector, fromClass, useState, contramap } from '../common/component'
import layersChart from './layersChart'
import inputWithSlider from '../common/components/inputWithSlider'
import metricsList from './metricsList'
import { paper, typography, divider, iconButton, popover, inputLabel, select, menuItem, formControl } from '../common/materialui'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import IconButton from '@material-ui/core/IconButton'
import Modal from '@material-ui/core/Modal'
import { pruningModifiers } from '../store/selectors/pruning'
import { changeSparsity } from '../store/actions/pruning'
import { panelEditIcon } from '../common/icons'
import AdvancedPruningEditor from './advancedPruningEditor'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 100
  },
  title: {
    marginBottom: '10px!important'
  },
  paper: {
    display: 'flex'
  },
  modifiersContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 20
  },
  modifierContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  modifierMenuContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 30px 30px 30px',
    '& .MuiTextField-root': {
      width: '100px',
      marginTop: '10px!important',
      marginBottom: '10px!important'
    }
  },
  formControl: {
    marginTop: '15px!important',
    marginBottom: '15px!important'
  },
  presetFiltersText: {
    marginTop: '20px!important',
    marginBottom: '10px!important'
  },
  layersChartContainer: {
    flexGrow: 1,
    marginTop: 20,
    marginBottom: 20
  },
  metricsList: {
    marginTop: 20,
    marginLeft: 20
  },
  divider: {
    paddingTop: 20,
    paddingBottom: 20
  },
  sparsitySlider: {
    paddingTop: 60
  }
}

const sparsitySlider = inputWithSlider.contramap(props => merge({
  label: 'Sparsity',
  onChange: value => props.dispatch(changeSparsity(value / 100, props.modifier)),
  value: props.modifier.sparsity * 100
}, props))

const secondPlotMenu = Component(props => compose(
  fold(props),
  formControl({
    variant: 'outlined',
    classes: { root: props.classes.formControl } }),
  concat(inputLabel({
    id: 'secondPlotMenu',
    shrink: true }, 'Chart 2nd plot')),
  contramap(merge({ customRenderer: true })),
  select({
    labelId: 'secondPlotMenu',
    label: 'Chart 2nd plot',
    defaultValue: 'executionTime' }),
  reduce(concat, nothing()))([
  menuItem({ value: 'none' }, 'None'),
  menuItem({ value: 'trainableLayers' }, 'Trainable Layers'),
  menuItem({ value: 'executionTime' }, 'Dense vs Sparse Execution Time'),
  menuItem({ value: 'flops' }, 'Dense vs Sparse Flops'),
  menuItem({ value: 'sparseSpeedup' }, 'Sparse Speedup'),
  menuItem({ value: 'lossSensitivity' }, 'Loss Sensitivity'),
  menuItem({ value: 'performanceSensitivity' }, 'Performance Sensitivity') ]))

const pruningTypeMenu = Component(props => compose(
  fold(props),
  formControl({
    variant: 'outlined',
    classes: { root: props.classes.formControl } }),
  concat(inputLabel({
    id: 'pruningType',
    shrink: true }, 'Pruning type')),
  contramap(merge({ customRenderer: true })),
  select({
    labelId: 'pruningType',
    label: 'Pruning type',
    defaultValue: 'unstructured' }),
  reduce(concat, nothing()))([
  menuItem({ value: 'unstructured' }, 'Unstructured'),
  menuItem({ value: 'block4' }, 'Block 4 (INT8 Quantization)'),
  menuItem({ value: 'block2' }, 'Block 2 (INT16 Quantization)'),
  menuItem({ value: 'channel' }, 'Channel') ]))

const modifierMenuContent = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('modifierMenuContent') })),
  reduce(concat, nothing()))([
  secondPlotMenu,
  pruningTypeMenu,
  typography({ className: prop('presetFiltersText') }, 'Preset filters'),
  sparsitySlider,
  inputWithSlider.contramap(merge({
    label: 'Performance',
    value: 2
  })),
  inputWithSlider.contramap(merge({
    label: 'Loss',
    value: 0.4
  })) ]))

const modifierMenu = Component(props => compose(
  fold(props),
  useState('anchorEl', 'setAnchorEl', null),
  concat(popover(props => ({
    anchorEl: props.anchorEl,
    open: Boolean(props.anchorEl),
    onClose: () => props.setAnchorEl(null) }),
    modifierMenuContent)),
  iconButton(props => ({
    onClick: e => props.setAnchorEl(e.currentTarget)
  })))(
  fromClass(MoreVertIcon).contramap(always({}))))

const editButton = ({ setSelectedModifier, modifier }) =>
  <IconButton onClick={() => setSelectedModifier(modifier)}>
    {panelEditIcon}
  </IconButton>

const advancedPruningModal = ({ selectedModifier, setSelectedModifier }) =>
  <Modal
    open={!!selectedModifier}
    disableScrollLock>
    <AdvancedPruningEditor
      modifier={selectedModifier || {}}
      onClose={() => setSelectedModifier(null)}/>
  </Modal>

const modifierChart = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('modifierContainer') })),
  reduce(concat, nothing()))([
  layersChart.contramap(mergeDeepLeft({
    classes: { root: props.classes.layersChartContainer } })),
  sparsitySlider.contramap(mergeDeepLeft({
    classes: { root: props.classes.sparsitySlider }
  })),
  fromClass(editButton),
  modifierMenu ]))

const modifierContainers = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('modifiersContainer') })),
  concat(fromClass(advancedPruningModal)),
  reduce(concat, nothing()),
  map(compose(modifierChart.contramap, merge, objOf('modifier'))))(
  props.modifiers))

export default Component(props => compose(
  fold(props),
  useStyles(styles),
  useSelector('modifiers', pruningModifiers),
  useState('selectedModifier', 'setSelectedModifier', null),
  map(toContainer({ className: prop('container') })),
  concat(typography({
    variant: 'h5',
    className: prop('title') }, 'Pruning')),
  paper({
    elevation: 2,
    className: prop('paper') }),
  reduce(concat, nothing()))([
  metricsList.contramap(props => mergeDeepLeft({
    classes: { root: props.classes.metricsList } }, props)),
  divider.contramap(props => ({
    classes: { root: props.classes.divider },
    orientation: 'vertical',
    flexItem: true })),
  modifierContainers]))
