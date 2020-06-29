import { compose, reduce, concat, map, prop, merge, objOf, isNil,
  when, propEq, __ } from 'ramda'
import debounce from 'lodash.debounce'
import { Form } from 'react-bootstrap'
import { Component, fold, nothing, useStyles, toContainer,
  useSelector, fromElement, useDispatch, branch, fromClass, useState } from '../common/component'
import { allModifiers, selectedModifier } from '../store/selectors/modifiers'
import { sparsityLevel } from '../store/selectors/settings'
import { selectModifier, addModifier, removeSelectedModifier } from '../store/actions/modifiers'
import { changeSparsityLevel } from '../store/actions/settings'

const styles = {
  container: props => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 20,
    paddingBottom: 15,
    background: props.theme === 'dark' ? 'rgba(38, 43, 45, 1)' : 'rgba(228, 234, 240, 1)',
    borderRadius: 5
  }),
  title: props => ({
    fontSize: 13,
    marginBottom: 5,
    paddingTop: 15,
    color: props.theme === 'dark' ? 'white' : '#495057'
  }),
  profileName: {
    fontSize: 18,
    color: 'white'
  },
  layerList: {
    display: 'flex',
    marginTop: 5
  },
  addButton: {
    color: '#5BAEFB',
    padding: '2px 5px 3px 5px',
    fontSize: 12,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  sparsityRange: {
    width: 150
  }
}

const modifierStyles = {
  layerName: props => ({
    display: 'inline-block',
    marginRight: 5,
    padding: '2px 5px 3px 5px',
    textAlign: 'center',
    fontSize: 10,
    color: 'white',
    background: props.theme === 'dark' ? props.selected ? '#5C93E3' : '#2E4777' : props.selected ? 'rgba(112, 176, 234, 1)' : 'rgba(193, 216, 238, 1)',
    borderRadius: 2,
    lineHeight: '18px'
  })
}

const nothingIfNoSelectedModifier = branch(compose(isNil, prop('selectedModifier')), nothing())

const modifier = Component(props => compose(
  fold(props),
  useStyles(modifierStyles))(
    fromElement('span').contramap(props => merge(props, {
      onClick: () => props.dispatch(selectModifier(props.modifier)),
      className: props.classes.layerName,
      children: props.modifier.label }))))

const addButton = Component(props => compose(
  fold(props))(
  fromElement('span').contramap(props => ({
    onClick: () => props.dispatch(addModifier()),
    className: props.classes.addButton,
    children: 'add' }))))

const removeButton = Component(props => compose(
  fold(props))(
  fromElement('span').contramap(props => ({
    onClick: () => props.dispatch(removeSelectedModifier()),
    className: props.classes.addButton,
    children: 'remove' }))))

const list = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('layerList') })),
  concat(__, nothingIfNoSelectedModifier(removeButton)),
  concat(__, addButton),
  reduce(concat, nothing()),
  map(compose(
    modifier.contramap, merge,
    when(propEq('modifier', props.selectedModifier), merge({ selected: true })),
    objOf('modifier'))))(
  props.modifiers))

const debounceChangeSparsityLevel = debounce((value, props) => props.dispatch(changeSparsityLevel(value)), 200)

const sparsityRange = fromClass(Form.Control).contramap(props => merge(props, {
  type: 'range',
  value: props.localSparsityLevel || props.sparsityLevel,
  className: props.classes.sparsityRange,
  onChange: e => {
    props.setLocalSparsityLevel(e.target.value)
    debounceChangeSparsityLevel(e.target.value, props)
  }
}))

export default Component(props => compose(
  fold(props),
  useDispatch,
  useSelector('selectedModifier', selectedModifier),
  useSelector('modifiers', allModifiers),
  useSelector('sparsityLevel', sparsityLevel),
  useState('localSparsityLevel', 'setLocalSparsityLevel', null),
  useStyles(styles),
  map(toContainer({ className: prop('container') })),
  reduce(concat, nothing()))([
  fromElement('span').contramap(props => merge(props, { children: 'Modifiers', className: props.classes.title })),
  list,
  fromElement('span').contramap(props => merge(props, { children: 'Sparsity', className: props.classes.title })),
  sparsityRange ]))
