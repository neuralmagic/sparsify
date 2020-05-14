import { compose, reduce, concat, map, prop, merge } from 'ramda'
import { Component, fold, nothing, useStyles, toContainer, useSelector,
  fromElement } from '../common/component'
import { selectedProfile } from '../store/selectors/profiles'

const styles = {
  container: props => ({
    display: 'flex',
    flexDirection: 'column',
    minWidth: 250
  }),
  title: props => ({
    fontSize: 10,
    color: props.theme === 'dark' ? '#AAAAAA' : '#868E96'
  }),
  profileName: props => ({
    fontSize: 18,
    color: props.theme === 'dark' ? 'white' : '#495057'
  })
}

export default Component(props => compose(
  fold(props),
  useSelector('selectedProfile', selectedProfile),
  useStyles(styles),
  map(toContainer({ className: prop('container') })),
  reduce(concat, nothing()))([
    fromElement('span').contramap(props => merge(props, { children: 'Active Profile', className: props.classes.title })),
    fromElement('span').contramap(props => merge(props, { children: props.selectedProfile && props.selectedProfile.name, className: props.classes.profileName })) ]))
