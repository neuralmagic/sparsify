import { compose, reduce, concat, merge, map, prop,
  curry, always } from 'ramda'
import { Form } from 'react-bootstrap'
import { selectedTheme } from './store/selectors/theme'
import { selectedProject } from './store/selectors/projects'
import { changeTheme } from './store/actions/theme'
import { createProjectFromFile } from './store/actions/projects'
import { onlyOnRootPage, onlyOnProjectPage, redirectToRootIfNoSelectedProject } from './routes'
import { Component, fold, toContainer, nothing,
  useStyles, useSelector, useDispatch, useJssProvider,
  fromClass, fromElement } from './common/component'
import { useHashRouter } from './common/router'
import { useAsDropdownContent, useAsDropdown, useDropdownState, dropdownMenu } from './common/dropdown'
import { useModal } from './common/modal'
import { isDevelopment } from './common/environment'
import { image } from './components'
import helpMenu from './help/menu'
import { newProjectDialog } from './projects/import'
import projectContainer from './projects/projectContainer'
import { headerDropdownStyles } from './common/styles/components'
import './common/styles/reset.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const appStyles = {
  '@global': {
    '#app': {
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
    overflowY: 'auto',
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

const mainContentStyles = {
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 100,
    paddingLeft: 100,
  }
}

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

export default Component(props => compose(
  fold(props),
  useHashRouter,
  useJssProvider({ id: { minify: !isDevelopment() } }),
  useSelector('theme', selectedTheme),
  useSelector('selectedProject', selectedProject),
  useStyles(appStyles),
  map(toContainer({ className: prop('mainContainer') })),
  reduce(concat, nothing()))([
  header,
  onlyOnRootPage(mainContent),
  redirectToRootIfNoSelectedProject(onlyOnProjectPage(projectContainer))]))
