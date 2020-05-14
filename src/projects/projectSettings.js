import { compose, reduce, concat, map, prop, merge, propEq, always,
  tap, head, path, join, dropLast, split } from 'ramda'
import { Component, fold, nothing, useStyles, useState, toContainer,
  fromClass, branch, fromElement, useRef, useDispatch } from '../common/component'
import { image } from '../components'

const styles = {
  container: props => ({
    background: props.theme === 'dark' ? '#1d2022' : '#f8f9fa'
  })
}

export default Component(props => compose(
  fold(props),
  useStyles(styles),
  map(toContainer({ className: prop('container') })),
  reduce(concat, nothing()))([
    image.contramap(always({ src: `assets/project_settings${props.theme === 'light' ? '_light' : ''}.png`, width: 1344, height: 614 }))]))
