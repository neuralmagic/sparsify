import { compose, reduce, concat, map, prop, merge,
  propEq, objOf, always, isNil, path, __ } from 'ramda'
import { Component, fold, nothing, useStyles, toContainer, useSelector,
  branch, fromElement, useDispatch } from '../common/component'
import { allProfiles, selectedProfile } from '../store/selectors/profiles'
import { selectProfile, addProfile } from '../store/actions/profiles'
import { image } from '../components'

const styles = {
  container: props => ({
    background: props.theme === 'dark' ? 'linear-gradient(rgb(28, 31, 34) 22%, rgb(0, 0, 0) 100%)' : 'rgba(149, 167, 183, 1)',
    height: 105,
    flexShrink: 0,
    zIndex: 1,
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 65,
    borderBottom: `7px solid ${props.theme === 'dark' ? '#61676D' : 'white'}`,
    boxShadow: props.theme === 'dark' ? 'rgba(0, 0, 0, 0.498) 0px 2px 2px' : 'rgba(0, 0, 0, 0.247) 0px 2px 2px'
  }),
  addProfileContainer: props => ({
    cursor: 'pointer',
    background: props.theme === 'dark' ? '#2A2C2F' : 'rgba(217, 225, 232, 1)',
    transition: 'background 0.2s ease-in, color 0.2s ease-in',
    width: 75,
    marginTop: 11,
    marginBottom: 8,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'normal',
    color: props.theme === 'dark' ? '#AAAAAA' : '#868E96',
    '&:hover': {
      background: props.theme === 'dark' ? '#3E4146' : 'white',
      color: props.theme === 'dark' ? '#AAAAAA' : '#495057'
    }
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
  profileContainerOuter: props => ({
    display: 'flex',
    cursor: 'pointer',
    flexDirection: 'row',
    marginRight: props.selected ? 0 : 9,
    marginLeft: props.selected ? -9: 0,
    paddingTop: props.selected ? 9 : 19,
    alignItems: 'flex-end'
  }),
  profileContainer: props => ({
    height: '100%',
    position: 'relative',
    transition: 'background 0.2s ease-in, color 0.2s ease-in',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: props.selected ? 10 : 10,
    background: props.theme === 'dark' ? props.selected ? '#61676D' : '#3E4146' : props.selected ? 'white' : 'rgba(217, 225, 232, 1)',
    width: 120,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: props.selected ? 0 : 5,
    borderBottomRightRadius: props.selected ? 0 : 5,
    color: props.theme === 'dark' ? props.selected ? 'white' : '#AAAAAA' : props.selected ? '#495057' : '#868E96',
    marginBottom: props.selected ? 0 : 7,
    paddingBottom: props.selected ? 7 : 0,
    '&:hover': {
      background: props.theme === 'dark' ? '#61676D' : 'white',
      color: props.theme === 'dark' ? 'white' : '#495057'
    },
    boxShadow: props.theme === 'dark' ?
      props.selected ? 'none' : '2px 2px 3px rgba(0, 0, 0, 0.501960784313725)' :
      props.selected ? 'none' : '2px 2px 3px rgba(0, 0, 0, 0.250980392156863)'
  }),
  name: props => ({
    paddingTop: props.selected ? 9 : 6,
    whiteSpace: 'normal',
    fontSize: 12,
    flexGrow: 1,
    lineHeight: '15px'
  }),
  speedupFactor: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 18,
    lineHeight: '18px'
  },
  speedupFactorImage: {
    marginLeft: 5
  },
  recoverabilityScore: {
    fontSize: 12
  }
}

const nothingIfNotSelected = branch(propEq('selected', false), nothing())
const nothingIfNoSpeedup = branch(compose(isNil, path(['profile', 'speedupFactor'])), nothing())
const inverseCornerLeft = image.contramap(props =>
  ({ src: `assets/inverse_corner_left${props.theme === 'light' ? '_light' : ''}.svg`, width: 9, height: 8 }))
const inverseCornerRight = image.contramap(props =>
  ({ src: `assets/inverse_corner_right${props.theme === 'light' ? '_light' : ''}.svg`, width: 9, height: 8 }))

const profile = Component(props => compose(
  fold(merge(props, { selected: props.profile.id === props.selectedProfile.id })),
  useStyles(profileContainerStyle),
  map(toContainer({ className: prop('profileContainerOuter'), onClick: () => props.dispatch(selectProfile(props.profile)) })),
  concat(nothingIfNotSelected(inverseCornerLeft)),
  concat(__, nothingIfNotSelected(inverseCornerRight)),
  map(toContainer({ className: prop('profileContainer') })),
  reduce(concat, nothing()))(
  [
    fromElement('div').contramap(props => ({ className: props.classes.name, children: props.profile.name })),
    nothingIfNoSpeedup(fromElement('div').contramap(props => ({
      className: props.classes.speedupFactor,
      children: [
        props.profile.speedupFactor + 'X',
        image.contramap(props => ({ className: props.classes.speedupFactorImage, src: 'assets/go_up.svg', width: 15, height: 17 })).fold(props)] }))),
    fromElement('div').contramap(props => ({ className: props.classes.recoverabilityScore, children: props.profile.recoverabilityScore })) ]))

const profileList = Component(props => compose(
  fold(props),
  reduce(concat, nothing()),
  map(compose(profile.contramap, merge, objOf('profile'))))(
  props.profiles))

const addProfileButton = Component(props => compose(
  fold(props),
  map(toContainer({
    className: prop('addProfileContainer'),
    onClick: () => props.dispatch(addProfile()) })),
  reduce(concat, nothing()))(
  [
    fromElement('span').contramap(always({ className: props.classes.addProfileText, children: 'Add custom profile' })),
    image.contramap(always({ className: props.classes.addProfileIcon, src: 'assets/add_profile.svg', width: 16, height: 16 })) ]))

export default Component(props => compose(
  fold(props),
  useDispatch,
  useSelector('profiles', allProfiles),
  useSelector('selectedProfile', selectedProfile),
  useStyles(styles),
  map(toContainer({ className: prop('container') })),
  reduce(concat, nothing()))(
  [
    profileList,
    addProfileButton ]))
