import { merge } from 'ramda'
import { fromClass } from './component'
import SvgIcon from '@material-ui/core/SvgIcon'
import whiteLogo from '../assets/logo_white.svg'

export const logo = fromClass(SvgIcon).contramap(merge({
  component: whiteLogo,
  viewBox: '0 0 88 81'
}))
