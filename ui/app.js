import React from 'react'
import { compose, reduce, concat, map, prop } from 'ramda'
import { selectedProject } from './store/selectors/projects'
import { onlyOnRootPage, onlyOnProjectPage, redirectToRootIfNoSelectedProject } from './routes'
import { Component, fold, toContainer, nothing, fromClass,
  useStyles, useSelector, useDispatch, useJssProvider, useState } from './common/component'
import { drawer, divider, typography, themeProvider, createTheme,
  cardMedia, useTheme, modal, button } from './common/materialui'
import { useHashRouter } from './common/router'
import { isDevelopment } from './common/environment'
import projectList from './projects/projectList'
import projectMenu from './projects/projectMenu'
import projectContainer from './projects/projectContainer'
import newProject from './projects/newProject'
import selectedProjectNav from './projects/selectedProjectNav'
import { logo } from './common/icons'
import AddIcon from '@material-ui/icons/Add'

const drawerWidth = 280
const fonts = ['Open Sans', 'sans-serif']

const drawerTheme = createTheme({
  menu: {
    textColor: '#8E9AA2',
    textSelectedColor: '#8793D0',
    sectionBackground: '#2E2E2E'
  },
  palette: {
    text: {
      primary: '#C2D1DB',
      secondary: '#8E9AA2'
    }
  },
  typography: { fontFamily: fonts }
})

const mainContentTheme = createTheme({
  background: '#F4F6F8',
  disabledColor: '#E0E0E0',
  palette: {
    primary: { main: '#4652B1' },
    secondary: { main: '#ff9900' },
    text: {
      secondary: '#777777'
    }
  },
  typography: { fontFamily: fonts }
})

const appStyles = {
  '@global': {
    'div[role=presentation]': {
      overflowY: 'auto',
      display: 'flex',
      justifyContent: 'center',
      paddingLeft: 120,
      paddingRight: 120
    },
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
  drawer: {
    background: '#1d1d1d!important',
    width: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    flexDirection: 'row',
    color: 'white!important',
    padding: '20px 15px 20px 20px'
  },
  drawerDivider: {
    background: '#3E3E3E!important',
    margin: '18px 0 15px 0!important'
  },
  mainContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowY: 'auto',
    backgroundColor: 'white'
  },
  logo: {
    width: '30px!important',
    height: '28px!important',
    marginRight: 10
  }
}

const mainContentStyles = {
  scrollContainer: props => ({
    flexGrow: 1,
    overflowY: 'auto',
    paddingTop: 10,
    paddingLeft: drawerWidth + 50,
    backgroundColor: props.theme.background
  }),
  mainContainer: {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingBottom: 100
  },
  startPageImage: {
    width: 953,
    height: 926,
    backgroundPosition: 'top!important',
    marginBottom: 100
  },
  newProjectButton: {
    position: 'absolute!important',
    bottom: 50,
    right: 100,
    borderRadius: '30px!important',
    color: 'white!important',
    height: '50px!important',
    textTransform: 'none!important',
    fontSize: '1.1rem!important'
  },
  newProjectModal: {
    display: 'flex',
    paddingTop: '12vh',
    justifyContent: 'center'
  }
}

const appDrawerHeader = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('drawerHeader') })),
  reduce(concat, nothing()))([
  logo.contramap(props => ({ className: props.classes.logo })),
  typography({ variant: 'h5' }, 'Sparsify') ]))

const appDrawer = Component(props => compose(
  fold(props),
  drawer({
    classes: { paper: props.classes.drawer },
    anchor: 'left',
    open: true,
    variant: 'persistent'
  }),
  reduce(concat, nothing()))([
  appDrawerHeader,
  onlyOnProjectPage(selectedProjectNav),
  divider.contramap(props => ({ className: props.classes.drawerDivider })),
  onlyOnProjectPage(projectMenu),
  onlyOnRootPage(projectList)]))

const newProjectModal = modal(props => ({
  className: props.classes.newProjectModal,
  open: props.newProjectModalOpen,
  onClose: () => props.setNewProjectModalOpen(false)
}), newProject)

const newProjectButton = button(props => ({
  variant: 'contained',
  color: 'secondary',
  size: 'large',
  classes: { root: props.classes.newProjectButton },
  startIcon: fromClass(AddIcon).fold({ fontSize: 'large' }),
  onClick: () => props.setNewProjectModalOpen(true)
}), 'New Project')

const mainContent = Component(props => compose(
  fold(props),
  useTheme,
  useStyles(mainContentStyles),
  useState('newProjectModalOpen', 'setNewProjectModalOpen', false),
  map(toContainer({ className: prop('scrollContainer') })),
  map(toContainer({ className: prop('mainContainer') })),
  reduce(concat, nothing()))([
  cardMedia.contramap(props => ({
    image: 'assets/start_page.png',
    className: props.classes.startPageImage
  })),
  newProjectButton,
  newProjectModal ]))

export default Component(props => compose(
  fold(props),
  useDispatch,
  useHashRouter,
  useJssProvider({ id: { minify: !isDevelopment() } }),
  useSelector('selectedProject', selectedProject),
  useStyles(appStyles),
  concat(themeProvider({ theme: drawerTheme }, appDrawer)),
  themeProvider({ theme: mainContentTheme }),
  reduce(concat, nothing()))([
  onlyOnRootPage(mainContent),
  redirectToRootIfNoSelectedProject(onlyOnProjectPage(projectContainer))]))
