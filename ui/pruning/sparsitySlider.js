import { compose, reduce, concat, map, prop } from 'ramda'
import debounce from 'lodash.debounce'
import { slider, textField } from '../common/materialui'
import { Component, fold, nothing, useStyles, toContainer,
  useDispatch, useState } from '../common/component'
import { changeSparsityLevel } from '../store/actions/pruning'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 20
  },
  sparsityRange: {
    width: '150px!important',
    marginLeft: 20
  },
  field: {
    width: '80px!important'
  }
}

const debounceChangeSparsityLevel = debounce((value, props) => props.dispatch(changeSparsityLevel(value, props.modifier)), 50)

const sparsityField = textField.contramap(props => ({
  variant: 'outlined',
  label: 'Sparsity',
  className: props.classes.field,
  size: 'small',
  onChange: e => props.dispatch(changeSparsityLevel(e.target.value / 100)),
  value: props.localSparsityLevel || props.modifier.sparsityLevel * 100
}))

const sparsitySlider = slider.contramap(props => ({
  value: props.localSparsityLevel || props.modifier.sparsityLevel * 100,
  className: props.classes.sparsityRange,
  onChange: (e, value) => {
    props.setLocalSparsityLevel(value)
    debounceChangeSparsityLevel(value / 100, props)
  }
}))

export default Component(props => compose(
  fold(props),
  useDispatch,
  useState('localSparsityLevel', 'setLocalSparsityLevel', null),
  useStyles(styles),
  map(toContainer({ className: prop('container') })),
  reduce(concat, nothing()))([
  sparsityField,
  sparsitySlider ]))
