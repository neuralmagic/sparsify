import { merge } from 'ramda'
import { fromClass } from './component'
import SvgIcon from '@material-ui/core/SvgIcon'
import whiteLogo from '../assets/logo_white.svg'
import benchmarksIcon from '../assets/menu_benchmarks.svg'
import optimizationIcon from '../assets/menu_optimization.svg'
import settingsIcon from '../assets/menu_settings.svg'
import helpIcon from '../assets/menu_help.svg'
import performaceProfileIcon from '../assets/menu_performance_profile.svg'

export const logo = fromClass(SvgIcon).contramap(merge({
  component: whiteLogo,
  viewBox: '0 0 88 81'
}))

export const benchmarksMenuIcon = fromClass(SvgIcon).contramap(merge({
  component: benchmarksIcon,
  viewBox: '0 0 20 17'
}))

export const optimizationMenuIcon = fromClass(SvgIcon).contramap(merge({
  component: optimizationIcon,
  viewBox: '0 0 19 15'
}))

export const settingsMenuIcon = fromClass(SvgIcon).contramap(merge({
  component: settingsIcon,
  viewBox: '0 0 18 18'
}))

export const helpMenuIcon = fromClass(SvgIcon).contramap(merge({
  component: helpIcon,
  viewBox: '0 0 18 18'
}))

export const profileMenuIcon = fromClass(SvgIcon).contramap(merge({
  component: performaceProfileIcon,
  viewBox: '0 0 20 16'
}))
