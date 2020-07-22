import React from 'react'
import { compose, reduce, concat, merge, prop } from 'ramda'
import { Component, fold, nothing,
  useStyles, useDispatch, useState } from '../common/component'
import { accordion, accordionSummary, accordionDetails } from '../common/materialui'
import { navigateToProjectSection } from '../store/actions/navigation'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const styles = {
  accordion: {
    backgroundColor: '#232323!important',
    boxShadow: 'none!important'
  },
  accordionExpanded: {
    margin: '0!important'
  },
  accordionSummaryRoot: {
    minHeight: '48px!important',
    color: '#A3B6C1!important',
    fontSize: '14px!important'
  },
  accordionSummaryExpanded: {
    color: '#DF5B46!important',
    margin: '0px!important'
  },
  accordionSummaryExpandIcon: {
    color: '#A3B6C1!important'
  },
  accordionDetails: {
    backgroundColor: '#2E2E2E!important',
    color: '#A3B6C1!important'
  }
}

const menuAccordion = Component(props => compose(
  fold(merge(props, { customRenderer: true })),
  accordion({
    expanded: props.selectedSection === props.section,
    onChange: () => {
      props.setSelectedSection(props.section)
      props.dispatch(navigateToProjectSection(props.section))
    },
    classes: {
      root: props.classes.accordion,
      expanded: props.classes.accordionExpanded
    }
  }),
  reduce(concat, nothing()))([
  accordionSummary(
    merge(props.summaryProps, {
      classes: {
        root: props.classes.accordionSummaryRoot,
        expanded: props.classes.accordionSummaryExpanded,
        expandIcon: props.classes.accordionSummaryExpandIcon
      }
    }),
    props.summaryContent),
  accordionDetails(
    merge(props.detailsProps, {
      classes: {
        root: props.classes.accordionDetails
      }
    }),
    props.detailsContent)
]))

const benchmarks = menuAccordion.contramap(merge({
  section: 'benchmarks',
  summaryContent: 'Benchmarks',
  detailsContent: 'Benchmarks content'
}))

const optimization = menuAccordion.contramap(merge({
  section: 'optimization',
  summaryProps: { expandIcon: <ExpandMoreIcon/> },
  summaryContent: 'Optimization',
  detailsContent: 'Optimization content'
}))

const settings = menuAccordion.contramap(merge({
  section: 'settings',
  summaryContent: 'Settings',
  detailsContent: 'Settings content'
}))

const help = menuAccordion.contramap(merge({
  section: 'help',
  summaryProps: { expandIcon: <ExpandMoreIcon/> },
  summaryContent: 'Help',
  detailsContent: 'Help content'
}))

export default Component(props => compose(
  fold(props),
  useDispatch,
  useStyles(styles),
  useState('selectedSection', 'setSelectedSection', prop('selectedSection')),
  reduce(concat, nothing()))([
  benchmarks,
  optimization,
  settings,
  help]))
