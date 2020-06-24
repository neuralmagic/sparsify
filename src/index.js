import { compose, reduce, concat, merge, map, prop, isNil,
  curry, always } from 'ramda'
import { render } from 'react-dom'
import { Form } from 'react-bootstrap'
import store from './store'
import { selectedTheme } from './store/selectors/theme'
import { selectedProject } from './store/selectors/projects'
import { changeTheme } from './store/actions/theme'
import { createProjectFromFile } from './store/actions/projects'
import { Component, fold, toContainer, nothing,
  useStyles, useSelector, useDispatch, useJssProvider,
  useStoreProvider, fromClass, fromElement } from './common/component'
import { useHashRouter, useRoute, useRedirect } from './common/router'
import { useAsDropdownContent, useAsDropdown, useDropdownState, dropdownMenu } from './common/dropdown'
import { useModal } from './common/modal'
import { isDevelopment } from './common/environment'
import { image } from './components'
import { newProjectDialog } from './projects/import'
import profileSelector from './profiles/selector'
import epochScheduler from './modifiers/epochScheduler'
import modifiersList from './modifiers/modifiersList'
import layerIndexChart from './layers/indexChart'
import metricsList from './metrics/metricsList'
import './common/styles/reset.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const appStyles = {
  '@global': {
    'body': {
      width: '100%',
      height: '100%',
      position: 'fixed',
      display: 'flex',
      fontFamily: '"Open Sans Regular", "Open Sans", "sans-serif"',
      whiteSpace: 'nowrap'
    },
    '.vega-embed.has-actions': { paddingRight: '0!important', width: '100%!important' },
    '.vega-embed.has-actions details': { display: 'none' }
  },
  mainContainer: props => ({
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowY: 'scroll',
    ...props.theme === 'dark' && {
      backgroundColor: '#1c1f22',
      backgroundImage: 'url("assets/bg.png")',
      backgroundPosition: 'left top',
      backgroundRepeat: 'repeat',
      backgroundAttachment: 'scroll',
      backgroundSize: '46px 23px',
      backgroundOrigin: 'border-box'
    },
    ...props.theme === 'light' && {
      backgroundColor: 'white'
    }
  }),
  layerControls: props => ({
    background: props.theme === 'dark' ? '#151719' : '#f8f9fa',
    display: 'flex',
    paddingTop: 35,
    paddingBottom: 15,
    paddingRight: 35
  })
}

const headerStyles = {
  header: {
    background: '#303234',
    height: 55,
    borderBottom: '1px solid black',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    zIndex: 2
  },
  headerTitle: {
    color: 'white',
    flexGrow: 1,
    paddingLeft: 20,
    fontSize: 20
  }
}

const headerDropdownStyles = {
  dropdown: props => ({
    position: 'relative',
    display: 'flex',
    height: '100%',
    borderRight: '1px solid #3C3E42',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: props.isDropdownContentShown ? 'rgba(49, 129, 202, 1)' : null,
    '&:hover': {
      backgroundColor: 'rgba(49, 129, 202, 1)'
    },
    '&:after': {
      content: '" "',
      position: 'absolute',
      zIndex: -1,
      top: 0,
      right: 0,
      bottom: 0,
      border: '1px solid black'
    },
  }),
  dropdownContent: props => ({
    position: 'absolute',
    left: props.dropdownAlign === 'left' ? 0 : 'inherit',
    right: props.dropdownAlign === 'right' ? 0 : 'inherit',
    top: '100%',
    backgroundColor: '#202325',
    border: '1px solid #3A3A3A',
    boxShadow: 'rgba(0, 0, 0, 0.6) 2px 2px 5px'
  })
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
    flexShrink: 0,
    userSelect: 'none'
  },

  logo: {
    marginRight: 5
  }
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

const projectContainerStyles = {
  projectContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row'
  },
  mainContainer: props => ({
    flexGrow: 1,
    paddingLeft: 30,
    background: props.theme === 'dark' ? '#151719' : '#F8F9FA'
  }),
  sideContainer: props => ({
    width: 280,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    flexGrow: 0,
    borderRight: `1px solid ${props.theme === 'dark' ? '#4B4B4B' : '#C8CDD3'}`
  })
}

const redirectToRootIfNoSelectedProject = useRedirect('/', compose(isNil, prop('selectedProject')))

const themeCheckbox = fromClass(Form.Check).contramap(props => merge(props, {
  type: 'switch', checked: props.theme === 'dark', label: '', id: 'themeCheck' }))

const userMenu = Component(props => compose(
  fold(merge(props, { dropdownAlign: 'left' })),
  useDispatch,
  useDropdownState,
  useStyles(userMenuStyles),
  useAsDropdown,
  concat(image.contramap(props => ({ src: 'assets/logo_white.svg', width: 30, height: 30, className: props.classes.logo }))),
  concat(image.contramap(always({ src: 'assets/arrow_down.svg', width: 8, height: 4 }))),
  useAsDropdownContent)(
  dropdownMenu.contramap(props => merge(props, { items: [
    { label: 'New Project', onClick: props => props.setNewProjectModalShow(true), icon: 'assets/new_project.svg', iconWidth: 14, iconHeight: 14 },
    { label: 'Open Project', icon: 'assets/open_project.svg', iconWidth: 18, iconHeight: 18,
      fileSelect: true, accept: '.nmprj', onFileSelect: curry((props, file) => props.dispatch(createProjectFromFile(file))) },
    { label: 'Dark mode', icon: 'assets/moon_icon.svg', iconWidth: 14, iconHeight: 14, extraContent: themeCheckbox,
      onClick: props => props.dispatch(changeTheme(props.theme === 'dark' ? 'light' : 'dark')) } ] }))))

const helpMenu = Component(props => compose(
  fold(merge(props, { dropdownAlign: 'right' })),
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
  useStyles(headerStyles),
  useModal('NewProject', newProjectDialog),
  map(toContainer({ className: prop('header') })),
  reduce(concat, nothing()))([
  userMenu,
  fromElement('span').contramap(props => ({
    className: props.classes.headerTitle,
    children: props.selectedProject ? `${props.selectedProject.name}: Resnet-50` : '' })),
  helpMenu]))

const mainContent = Component(props => compose(
  fold(props),
  useStyles(mainContentStyles),
  map(toContainer({ className: prop('mainContent') })))(
  image.contramap(always({ src: `assets/main_content_stub_${props.theme}.png`, width: 1178, height: 631 }))))

const layerControls = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('layerControls') })),
  reduce(concat, nothing()))([
  modifiersList ]))

const projectSideContent = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('sideContainer') })),
  reduce(concat, nothing()))([
  profileSelector,
  epochScheduler,
  metricsList ]))

const projectContainer = Component(props => compose(
  fold(props),
  useStyles(projectContainerStyles),
  map(toContainer({ className: prop('projectContainer') })),
  concat(projectSideContent),
  map(toContainer({ className: prop('mainContainer') })),
  reduce(concat, nothing()))([
  layerControls,
  image.contramap(always({ src: `assets/settings_stub_${props.theme}.png`, width: 1041, height: 213 })),
  layerIndexChart ]))

const app = Component(props => compose(
  fold(props),
  useHashRouter,
  useJssProvider({ id: { minify: !isDevelopment() } }),
  useSelector('theme', selectedTheme),
  useSelector('selectedProject', selectedProject),
  useStyles(appStyles),
  map(toContainer({ className: prop('mainContainer') })),
  reduce(concat, nothing()))([
  header,
  useRoute('/', mainContent),
  redirectToRootIfNoSelectedProject(useRoute('/project/:id', projectContainer))]))

render(useStoreProvider(store, app.fold({})), document.body)
