import { compose, reduce, concat, map, prop, merge,
  addIndex, objOf, always, isNil, path, __ } from 'ramda'
import { Component, fold, nothing, useStyles, toContainer, useSelector,
  branch, fromElement, useDispatch } from '../common/component'
import { allProfiles, selectedProfile } from '../store/selectors/profiles'
import { selectProfile, addProfile } from '../store/actions/profiles'
import { image } from '../components'

const mapIndexed = addIndex(map)

const styles = {
  container: props => ({
    background: props.theme === 'dark' ? 'rgba(48, 54, 57, 1)' : 'rgba(208, 221, 232, 1)',
    height: 62,
    flexShrink: 0,
    zIndex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15
  }),
  title: props => ({
    fontSize: 16,
    color: props.theme === 'dark' ? 'white' : '#495057',
    marginRight: 15
  }),
  addProfileText: {
    fontSize: 12,
    textAlign: 'center',
    wordSpacing: 75,
    lineHeight: '14px',
    paddingBottom: 5
  },
  addProfileIcon: {
    flexShrink: 0
  }
}

const profileContainerStyle = {
  profileContainer: props => ({
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s ease-in, color 0.2s ease-in',
    background: props.theme === 'dark' ? props.selected ? 'rgba(49, 129, 202, 1)' : '#3E4146' : props.selected ? '#639AF1' : 'white',
    color: props.theme === 'dark' ? props.selected ? 'white' : '#AAAAAA' : props.selected ? '#495057' : '#868E96',
    '&:hover': {
      background: props.theme === 'dark' ? 'rgba(49, 129, 202, 1)' : '#639AF1',
      color: props.theme === 'dark' ? 'white' : '#495057'
    }
  }),
  name: {
    whiteSpace: 'normal',
    fontSize: 12,
    lineHeight: '15px'
  }
}

const profile = Component(props => compose(
  fold(merge(props, { selected: props.profile.id === props.selectedProfile.id })),
  useStyles(profileContainerStyle),
  map(toContainer({ className: prop('profileContainer'), onClick: () => props.dispatch(selectProfile(props.profile)) })),
  reduce(concat, nothing()))([
  fromElement('div').contramap(props => ({ className: props.classes.name, children: props.index + 1 })) ]))

const profileList = Component(props => compose(
  fold(props),
  reduce(concat, nothing()),
  mapIndexed((p, index) => compose(profile.contramap, merge, merge({ index }), objOf('profile'))(p)))(
  props.profiles))

const addProfileButton = image.contramap(props => ({
  className: props.classes.addProfileIcon,
  src: 'assets/add_profile.svg',
  width: 20, height: 20,
  onClick: () => props.dispatch(addProfile()) }))

export default Component(props => compose(
  fold(props),
  useDispatch,
  useSelector('profiles', allProfiles),
  useSelector('selectedProfile', selectedProfile),
  useStyles(styles),
  map(toContainer({ className: prop('container') })),
  reduce(concat, nothing()))([
  fromElement('span').contramap(merge({ className: prop('title'), children: 'Profile' })),
  profileList,
  addProfileButton ]))
