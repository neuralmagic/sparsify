import { compose, reduce, concat, map, prop } from 'ramda'
import debounce from 'lodash.debounce'
import { slider, textField } from '../common/materialui'
import { Component, fold, nothing, useStyles, toContainer,
  useSelector, useDispatch, fromClass, useState } from '../common/component'
import { sparsityLevel } from '../store/selectors/settings'
import { changeSparsityLevel } from '../store/actions/settings'

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

const debounceChangeSparsityLevel = debounce((value, props) => props.dispatch(changeSparsityLevel(value)), 50)

const sparsityField = textField.contramap(props => ({
  variant: 'outlined',
  label: 'Sparsity',
  className: props.classes.field,
  size: 'small',
  onChange: e => props.dispatch(changeSparsityLevel(e.target.value / 100)),
  value: props.localSparsityLevel || props.sparsityLevel * 100
}))

const sparsitySlider = slider.contramap(props => ({
  value: props.localSparsityLevel || props.sparsityLevel * 100,
  className: props.classes.sparsityRange,
  onChange: (e, value) => {
    props.setLocalSparsityLevel(value)
    debounceChangeSparsityLevel(value / 100, props)
  }
}))

export default Component(props => compose(
  fold(props),
  useDispatch,
  useSelector('sparsityLevel', sparsityLevel),
  useState('localSparsityLevel', 'setLocalSparsityLevel', null),
  useStyles(styles),
  map(toContainer({ className: prop('container') })),
  reduce(concat, nothing()))([
  sparsityField,
  sparsitySlider ]))
