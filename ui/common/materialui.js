import { mergeRight } from 'ramda'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Slider from '@material-ui/core/Slider'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Accordion from '@material-ui/core/Accordion'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Popover from '@material-ui/core/Popover'
import Fab from '@material-ui/core/Fab'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import CardMedia from '@material-ui/core/CardMedia'
import Modal from '@material-ui/core/Modal'
import Step from '@material-ui/core/Step'
import Stepper from '@material-ui/core/Stepper'
import StepLabel from '@material-ui/core/StepLabel'
import StepConnector from '@material-ui/core/StepConnector'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fade from '@material-ui/core/Fade'
import { buildComponentWithChildren, fromClass } from './component'
import { ThemeProvider, createMuiTheme, useTheme as muiUseTheme } from '@material-ui/core/styles'

export const drawer = buildComponentWithChildren(Drawer)
export const divider = fromClass(Divider)
export const textField = fromClass(TextField)
export const listItemText = fromClass(ListItemText)
export const list = buildComponentWithChildren(List)
export const listItem = buildComponentWithChildren(ListItem)
export const slider = fromClass(Slider)
export const circularProgress = fromClass(CircularProgress)
export const typography = buildComponentWithChildren(Typography)
export const accordionSummary = buildComponentWithChildren(AccordionSummary)
export const accordionDetails = buildComponentWithChildren(AccordionDetails)
export const accordion = buildComponentWithChildren(Accordion)
export const iconButton = buildComponentWithChildren(IconButton)
export const paper = buildComponentWithChildren(Paper)
export const button = buildComponentWithChildren(Button)
export const themeProvider = buildComponentWithChildren(ThemeProvider)
export const popover = buildComponentWithChildren(Popover)
export const fab = buildComponentWithChildren(Fab)
export const inputLabel = buildComponentWithChildren(InputLabel)
export const select = buildComponentWithChildren(Select)
export const menuItem = buildComponentWithChildren(MenuItem)
export const formControl = buildComponentWithChildren(FormControl)
export const modal = buildComponentWithChildren(Modal)
export const stepper = buildComponentWithChildren(Stepper)
export const step = buildComponentWithChildren(Step)
export const stepLabel = buildComponentWithChildren(StepLabel)
export const fade = buildComponentWithChildren(Fade)
export const stepConnector = fromClass(StepConnector)
export const cardMedia = fromClass(CardMedia)

export const createTheme = createMuiTheme

export const useTheme = c => {
  const theme = muiUseTheme()

  return c.contramap(mergeRight({ theme }))
}
