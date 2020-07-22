import React from 'react'
import { compose, reduce, concat, merge, prop, reject, isNil, map, always } from 'ramda'
import { Component, fold, nothing, toContainer,
  useStyles, useDispatch, useState, branch } from '../common/component'
import { accordion, accordionSummary, accordionDetails, typography, useTheme } from '../common/materialui'
import { navigateToProjectSection } from '../store/actions/navigation'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { benchmarksMenuIcon, optimizationMenuIcon, settingsMenuIcon, helpMenuIcon } from '../common/icons'

const styles = {
  container: {
    paddingTop: 20
  },
  accordion: {
    backgroundColor: '#1d1d1d!important',
    boxShadow: 'none!important',
    '&:before': {
      backgroundColor: 'transparent!important'
    }
  },
  accordionExpanded: {
    margin: '0!important'
  },
  accordionSummaryRoot: ({ theme }) => ({
    height: '53px!important',
    minHeight: '53px!important',
    color: `${theme.menu.textColor}!important`,
    '& .MuiTypography-root': {
      fontSize: '14px!important'
    },
    '& .MuiAccordionSummary-content path': {
      fill: theme.menu.textColor
    }
  }),
  accordionSummaryExpanded: ({ theme }) => ({
    color: `${theme.menu.textSelectedColor}!important`,
    margin: '0px!important',
    '& .MuiAccordionSummary-content path': {
      fill: `${theme.menu.textSelectedColor}!important`
    },
    '& .MuiAccordionSummary-expandIcon': {
      marginRight: '-12px!important'
    }
  }),
  accordionSummaryExpandIcon: ({ theme }) => ({
    color: `${theme.menu.textColor}!important`
  }),
  accordionDetails: ({ theme }) => ({
    backgroundColor: `${theme.menu.sectionBackground}!important`,
    color: `${theme.menu.textColor}!important`
  })
}

const menuHeaderStyles = {
  menuIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    '& svg': {
      padding: 5,
      marginRight: 10,
      background: '#2a2a2a',
      borderRadius: 3
    }
  }
}

const nothingWhenNoDetailsContent = branch(compose(isNil, prop('detailsContent')), nothing())

const menuAccordion = Component(props => compose(
  fold(merge(props, { customRenderer: true })),
  accordion({
    expanded: props.selectedSection === props.section,
    onChange: () => {
      props.setSelectedSection(props.section)
      setTimeout(() => props.dispatch(navigateToProjectSection(props.section)), 180)
    },
    classes: {
      root: props.classes.accordion,
      expanded: props.classes.accordionExpanded
    }
  }),
  reduce(concat, nothing()),
  reject(isNil))([
  accordionSummary(
    merge(props.summaryProps, {
      classes: {
        root: props.classes.accordionSummaryRoot,
        expanded: props.classes.accordionSummaryExpanded,
        expandIcon: props.classes.accordionSummaryExpandIcon
      }
    }),
    props.summaryContent),
  nothingWhenNoDetailsContent(accordionDetails(
    merge(props.detailsProps, {
      classes: {
        root: props.classes.accordionDetails
      }
    }),
    props.detailsContent))
]))

const menuHeader = Component(props => compose(
  fold(props),
  useStyles(menuHeaderStyles),
  map(toContainer({ className: prop('menuIconContainer') })),
  reduce(concat, nothing()))([
  props.icon.contramap(always({})),
  typography({}, props.label) ]))

const benchmarks = menuAccordion.contramap(merge({
  section: 'benchmarks',
  summaryContent: menuHeader.fold({ label: 'Benchmarks', icon: benchmarksMenuIcon }),
}))

const optimization = menuAccordion.contramap(merge({
  section: 'optimization',
  summaryProps: { expandIcon: <ExpandMoreIcon/> },
  summaryContent: menuHeader.fold({ label: 'Optimization', icon: optimizationMenuIcon }),
  detailsContent: 'Checkpoints'
}))

const settings = menuAccordion.contramap(merge({
  section: 'settings',
  summaryContent: menuHeader.fold({ label: 'Project Settings', icon: settingsMenuIcon }),
}))

const help = menuAccordion.contramap(merge({
  section: 'help',
  summaryProps: { expandIcon: <ExpandMoreIcon/> },
  summaryContent: menuHeader.fold({ label: 'Help', icon: helpMenuIcon }),
  detailsContent: 'Help content'
}))

export default Component(props => compose(
  fold(props),
  useDispatch,
  useTheme,
  useStyles(styles),
  useState('selectedSection', 'setSelectedSection', prop('selectedSection')),
  reduce(concat, nothing()))([
  benchmarks,
  optimization,
  settings,
  help]))
