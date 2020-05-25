import { compose, reduce, concat, map, prop, always } from 'ramda'
import { Component, fold, nothing, useStyles, toContainer } from '../common/component'
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
  image.contramap(always({
    src: `assets/project_settings${props.theme === 'light' ? '_light' : ''}.png`,
    width: 1349,
    height: 76 }))]))
