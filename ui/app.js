import { compose, reduce, concat, map, prop } from 'ramda'
import { selectedProject } from './store/selectors/projects'
import { onlyOnRootPage, onlyOnProjectPage, redirectToRootIfNoSelectedProject } from './routes'
import { Component, fold, toContainer, nothing,
  useStyles, useSelector, useDispatch, useJssProvider } from './common/component'
import { drawer, divider, typography, themeProvider, createTheme } from './common/materialui'
import { useHashRouter } from './common/router'
import { isDevelopment } from './common/environment'
import projectList from './projects/projectList'
import projectMenu from './projects/projectMenu'
import projectContainer from './projects/projectContainer'
import selectedProjectNav from './projects/selectedProjectNav'
import { logo } from './common/icons'

const drawerWidth = 280

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
  }
})

const mainContentTheme = createTheme({
  background: '#F4F6F8',
  palette: {
    primary: {
      main: '#4652B1'
    }
  }
})

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
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 100,
    paddingLeft: 100,
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

const mainContent = Component(props => compose(
  fold(props),
  useStyles(mainContentStyles),
  map(toContainer({ className: prop('mainContent') })))(
  nothing()))

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
