import { merge } from 'ramda'
import React from 'react'
import { fromClass } from './component'
import SvgIcon from '@material-ui/core/SvgIcon'
import whiteLogo from '../assets/logo_white.svg'
import benchmarksIcon from '../assets/menu_benchmarks.svg'
import optimizationIcon from '../assets/menu_optimization.svg'
import settingsIcon from '../assets/menu_settings.svg'
import helpIcon from '../assets/menu_help.svg'
import performaceProfileIcon from '../assets/menu_performance_profile.svg'
import exportSvg from '../assets/export_icon.svg'
import deploymentProfileSvg from '../assets/new_project_deployment_profile.svg'
import nameProjectSvg from '../assets/new_project_name_project.svg'
import selectModelSvg from '../assets/new_project_select_model.svg'
import arrowRightSvg from '../assets/arrow_right.svg'
import arrowLeftSvg from '../assets/arrow_left.svg'
import panelEditSvg from '../assets/panel_edit.svg'

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

export const exportIcon = fromClass(SvgIcon).contramap(merge({
  component: exportSvg,
  viewBox: '0 0 18 18'
}))

export const deploymentProfileIcon = fromClass(SvgIcon).contramap(merge({
  component: deploymentProfileSvg,
  viewBox: '0 0 46 46'
}))

export const nameProjectIcon = fromClass(SvgIcon).contramap(merge({
  component: nameProjectSvg,
  viewBox: '0 0 46 46'
}))

export const selectModelIcon = fromClass(SvgIcon).contramap(merge({
  component: selectModelSvg,
  viewBox: '0 0 46 46'
}))

export const arrowRightIcon = fromClass(SvgIcon).contramap(merge({
  component: arrowRightSvg,
  viewBox: '0 0 6 10'
}))

export const arrowLeftIcon = fromClass(SvgIcon).contramap(merge({
  component: arrowLeftSvg,
  viewBox: '0 0 6 10'
}))

export const panelEditIcon =
  <SvgIcon component={panelEditSvg} viewBox='0 0 17 20'/>
