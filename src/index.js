import { render } from 'react-dom'
import { Component, fold, toContainer, nothing,
  useStyles, useState, useSelector, useDispatch, useJssProvider, useStoreProvider, fromClass, fromElement } from './common/component'
import { compose, reduce, concat, merge, map, __, prop,
  curry, always, omit } from 'ramda'
import { neuralMagicLogo, neuralMagicLogoText, image } from './components'
import { useHover } from './common/hooks'
import { useHashRouter, useRoute } from './common/router'
import { useAsDropdownContent, useAsDropdown, useDropdownState, dropdownMenu } from './common/dropdown'
import { useModal } from './common/modal'
import store from './store'
import { selectedTheme } from './store/selectors/theme'
import { selectedProject } from './store/selectors/projects'
import { changeTheme } from './store/actions/theme'
import { isDevelopment } from './common/environment'
import { newProjectDialog } from './projects/import'
import { Form } from 'react-bootstrap'
import projectSettings from './projects/projectSettings'
import profileSelector from './profiles/selector'
import './common/styles/reset.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const appStyles = {
  '@global': {
    'body': {
      width: '100%',
      height: '100%',
      position: 'fixed',
      display: 'flex',
      fontFamily: "'Open Sans Regular', 'Open Sans', sans-serif",
      whiteSpace: 'nowrap'
    }
  },
  mainContainer: props => ({
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowY: 'scroll',
    ...(props.theme === 'dark' && ({
      backgroundColor: '#1c1f22',
      backgroundImage: "url('assets/bg.png')",
      backgroundPosition: 'left top',
      backgroundRepeat: 'repeat',
      backgroundAttachment: 'scroll',
      backgroundSize: '46px 23px',
      backgroundOrigin: 'border-box'
    })),
    ...(props.theme === 'light' && ({
      backgroundColor: 'white'
    }))
  })
}

const sideMenuStyles = {
  sideMenuContainer: props => ({
    background: props.theme === 'dark' ? '#E9ECEF' : 'white',
    width: (props.isMenuHovered || props.isLocked) ? 185 : 53,
    maxWidth: 200,
    position: 'fixed',
    top: 0,
    zIndex: 1,
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
    flexShrink: 0,
    paddingTop: 15,
    height: '100%',
    transition: 'width 0.2s ease-in',
    '& > img': {
      marginLeft: 10
    },
    ...(props.theme === 'light' && ({
      boxShadow: '1px 0px 8px rgba(0, 0, 0, 0.196078431372549)'
    }))
  }),
  sideMenu: {
    paddingTop: 30
  },
  sideMenuPlaceholder: props => ({
    width: props.isLocked ? 200 : 53,
    transition: 'width 0.2s ease-in'
  }),
  logoText: props => ({
    position: 'fixed',
    left: 25,
    opacity: props.isMenuHovered || props.isLocked ? 1 : 0,
    transition: 'opacity 0.2s ease-in'
  })
}

const sideMenuLockStyles = {
  lockButton: props => ({
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    right: 10,
    top: 10,
    padding: 5,
    backgroundColor: props.isLockHovered ? '#CDD2D8' : 'transparent',
    cursor: 'pointer',
    opacity: props.isMenuHovered || props.isLocked ? 1 : 0,
    transition: 'all 0.1s ease-in'
  })
}

const sideMenuItemStyles = {
  sideMenuItem: props => ({
    paddingLeft: 10,
    height: 50,
    position: 'relative',
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    background: props.isHovered ? '#CDD2D8' : 'transparent',
    transition: 'all 0.2s ease-in'
  }),
  sideMenuItemText: props => ({
    whiteSpace: 'nowrap',
    color: props.isHovered ? '#027DB4' : '#333333',
    fontSize: 14,
    paddingLeft: 10,
    flexGrow: 1,
    opacity: props.isMenuHovered || props.isLocked ? 1 : 0,
    transition: 'opacity 0.2s ease-in-out'
  }),
  sideMenuItemImage: {
    position: 'absolute',
    right: 0,
    flexShrink: 0,
    marginRight: 11,
  },
  sideMenuItemImageHover: props => ({
    position: 'absolute',
    right: 0,
    flexShrink: 0,
    marginRight: 11,
    opacity: props.isHovered ? 1 : 0,
    transition: 'opacity 0.2s ease-in-out'
  })
}

const headerStyles = {
  header: {
    background: '#303234',
    height: 55,
    borderBottom: '1px solid black',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 50,
    flexShrink: 0,
    position: 'sticky',
    top: 0
  },
  headerTitle: {
    color: 'white',
    flexGrow: 1,
    fontSize: 20
  }
}

const headerDropdownStyles = {
  dropdown: props => ({
    position: 'relative',
    display: 'flex',
    height: '100%',
    borderLeft: '1px solid #3C3E42',
    paddingLeft: 24,
    paddingRight: 22,
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: props.isDropdownContentShown ? '#191D20' : null,
    '&:after': {
      content: '" "',
      position: 'absolute',
      zIndex: -1,
      top: 0,
      left: 0,
      bottom: 0,
      border: '0.4px solid black'
    },
    '&:hover': {
      backgroundColor: '#191D20'
    }
  }),
  dropdownContent: {
    position: 'absolute',
    right: 0,
    top: '100%',
    backgroundColor: '#202325',
    border: '1px solid #3A3A3A',
    boxShadow: 'rgba(0, 0, 0, 0.6) 2px 2px 5px'
  }
}

const userMenuStyles = {
  ...headerDropdownStyles,
  userIcon: {
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    fontSize: 12,
    color: 'white',
    justifyContent: 'center',
    backgroundColor: '#467CB1',
    borderRadius: 14,
    marginRight: 5,
    flexShrink: 0,
    userSelect: 'none'
  },
  
}

const helpStyles = {
  ...headerDropdownStyles,
  helpIcon: {
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginRight: 5,
    flexShrink: 0,
    userSelect: 'none'
  }
}

const mainContentStyles = {
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 100,
    paddingLeft: 100,
  }
}

const sideMenuItems = [
  { onClick: props => { props.setNewProjectModalShow(true); props.setIsMenuHovered(false); },
    srcNormal: 'assets/new_project.svg', srcHover: 'assets/new_project_hover.svg', text: 'New Project' },
  { srcNormal: 'assets/open_model.svg', srcHover: 'assets/open_model_hover.svg', text: 'Open Project' },
  { srcNormal: 'assets/visualizer.svg', srcHover: 'assets/visualizer_hover.svg', text: 'Visualizer' },
  { srcNormal: 'assets/save_model.svg', srcHover: 'assets/save_model_hover.svg', text: 'Save Project' }]

const sideMenuItem = Component(props => compose(
  fold(props),
  useHover('isHovered'),
  useStyles(sideMenuItemStyles),
  map(toContainer({ className: prop('sideMenuItem'), onClick: props.onClick })),
  reduce(concat, nothing()))([
    fromElement('span').contramap(props => ({ className: props.classes.sideMenuItemText, children: props.text })),
    image.contramap(props => ({
      src: props.srcNormal,
      className: props.classes.sideMenuItemImage,
      width: 30, height: 30 })),
    image.contramap(props => ({
      src: props.srcHover,
      className: props.classes.sideMenuItemImageHover,
      width: 30, height: 30 }))]))

const sideMenuLockButton = Component(props => compose(
  fold(omit(['ref'], props)),
  useHover('isLockHovered'),
  useStyles(sideMenuLockStyles),
  map(toContainer({ className: prop('lockButton') })))(
  image.contramap(props => ({
    onClick: () => { props.isLocked && props.setIsMenuHovered(false); props.setLocked(!props.isLocked); },
    src: props.isLocked ? 'assets/menu_lock_hover.svg' : 'assets/menu_lock.svg',
    width: 20, height: 20 }))))

const sideMenu = Component(props => compose(
  fold(omit(['ref'], props)),
  useModal('NewProject', newProjectDialog),
  map(toContainer({ className: prop('sideMenu') })),
  reduce(concat, nothing()),
  map(compose(sideMenuItem.contramap, merge, merge({ width: 30, height: 30 }))))(
  props.items))

const withSideMenu = curry((items, c) => Component(props => compose(
  fold(props),
  concat(__, c),
  useState('isLocked', 'setLocked', false),
  useHover('isMenuHovered'),
  useStyles(sideMenuStyles),
  concat(__, fromElement('div').contramap(props => ({ className: props.classes.sideMenuPlaceholder }))),
  map(toContainer({ className: prop('sideMenuContainer') })),
  reduce(concat, nothing()))([
    neuralMagicLogo.contramap(merge({ width: 32.7, height: 30 })),
    neuralMagicLogoText.contramap(props => merge(props, { className: props.classes.logoText, width: 86.5, height: 30 })),
    sideMenu.contramap(merge({ items })),
    sideMenuLockButton])))

const themeCheckbox = fromClass(Form.Check).contramap(props => merge(props, {
  type: 'switch', checked: props.theme === 'dark', label: '', id: 'themeCheck' }))

const userMenu = Component(props => compose(
  fold(props),
  useDispatch,
  useDropdownState,
  useStyles(userMenuStyles),
  useAsDropdown,
  concat(fromElement('div').contramap(props => ({ className: props.classes.userIcon, children: 'AO' }))),
  concat(image.contramap(always({ src: 'assets/arrow_down.svg', width: 7, height: 4 }))),
  useAsDropdownContent)(
  dropdownMenu.contramap(props => merge(props, { items: [
    { label: 'Profile', icon: 'assets/user_icon.svg', iconWidth: 11, iconHeight: 14 },
    { label: 'Dark mode', icon: 'assets/moon_icon.svg', iconWidth: 14, iconHeight: 14, extraContent: themeCheckbox,
      onClick: props => props.dispatch(changeTheme(props.theme === 'dark' ? 'light' : 'dark')) },
    { label: 'Log out', icon: 'assets/exit_icon.svg', iconWidth: 14, iconHeight: 14 } ] }))))

const helpMenu = Component(props => compose(
  fold(props),
  useDropdownState,
  useStyles(helpStyles),
  useAsDropdown,
  concat(image.contramap(always({ src: 'assets/help_icon.svg', width: 18, height: 18 }))),
  useAsDropdownContent)(
  dropdownMenu.contramap(props => merge(props, { items: [
    { label: 'Get latest version', icon: 'assets/get_latest_version.svg', iconWidth: 14, iconHeight: 14 },
    { label: 'Make a suggestion', icon: 'assets/make_a_suggestion.svg', iconWidth: 14, iconHeight: 14 },
    { label: 'Help center', icon: 'assets/help_center.svg', iconWidth: 14, iconHeight: 14 },
    { label: 'Community', icon: 'assets/community.svg', iconWidth: 14, iconHeight: 14 },
    { label: 'Contact support', icon: 'assets/contact_support.svg', iconWidth: 14, iconHeight: 14 } ] }))))

const header = Component(props => compose(
  fold(props),
  useSelector('selectedProject', selectedProject),
  useStyles(headerStyles),
  map(toContainer({ className: prop('header') })),
  reduce(concat, nothing()))([
  fromElement('span').contramap(props => ({
    className: props.classes.headerTitle,
    children: props.selectedProject ? `${props.selectedProject.name}: Resnet50` : '' })),
  helpMenu,
  userMenu]))

const mainContent = Component(props => compose(
  fold(props),
  useStyles(mainContentStyles),
  map(toContainer({ className: prop('mainContent') })))(
  image.contramap(always({ src: `assets/main_content_stub${props.theme === 'light' ? '_light' : ''}.png`, width: 1178, height: 631 }))))

const app = Component(props => compose(
  fold(props),
  useHashRouter,
  useJssProvider({ id: { minify: !isDevelopment() } }),
  useSelector('theme', selectedTheme),
  useStyles(appStyles),
  withSideMenu(sideMenuItems),
  map(toContainer({ className: prop('mainContainer') })),
  reduce(concat, nothing()))([
    header,
    useRoute('/', mainContent),
    useRoute('/project/:id', profileSelector),
    useRoute('/project/:id', projectSettings)]))

render(useStoreProvider(store, app.fold({})), document.body)
