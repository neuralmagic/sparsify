import { compose, reduce, concat, map } from 'ramda'
import debounce from 'lodash.debounce'
import { slider, textField } from '../materialui'
import { Component, fold, nothing, useStyles, toContainer,
  useDispatch, useState } from '../component'

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  slider: {
    width: '150px!important',
    marginLeft: 20
  },
  field: {
    width: '100px!important'
  }
}

const debounceOnChange = debounce((value, props) => props.onChange(value), 50)

const valueField = textField.contramap(props => ({
  variant: 'outlined',
  label: props.label,
  className: props.classes.field,
  size: 'small',
  onChange: e => {
    props.setLocalValue(e.target.value)
    props.onChange(e.target.value)
  },
  value: props.localValue
}))

const valueSlider = slider.contramap(props => ({
  value: props.localValue,
  className: props.classes.slider,
  onChange: (e, value) => {
    props.setLocalValue(value)
    debounceOnChange(value, props)
  }
}))

export default Component(props => compose(
  fold(props),
  useDispatch,
  useState('localValue', 'setLocalValue', props.value),
  useStyles(styles),
  map(toContainer({
    className: classes => `${classes.root} ${props.classes && props.classes.root}` })),
  reduce(concat, nothing()))([
  valueField,
  valueSlider ]))
