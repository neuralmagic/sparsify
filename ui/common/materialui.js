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
import { buildComponentWithChildren, fromClass } from './component'

export const drawer = buildComponentWithChildren(Drawer)
export const divider = fromClass(Divider)
export const textField = fromClass(TextField)
export const listItemText = fromClass(ListItemText)
export const list = buildComponentWithChildren(List)
export const listItem = buildComponentWithChildren(ListItem)
export const slider = fromClass(Slider)
export const typography = buildComponentWithChildren(Typography)
export const accordionSummary = buildComponentWithChildren(AccordionSummary)
export const accordionDetails = buildComponentWithChildren(AccordionDetails)
export const accordion = buildComponentWithChildren(Accordion)
export const iconButton = buildComponentWithChildren(IconButton)
export const paper = buildComponentWithChildren(Paper)
export const button = buildComponentWithChildren(Button)
