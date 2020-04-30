import React from 'react'
import { compose, reduce, concat, map, prop, merge, propEq } from 'ramda'
import { Component, fold, nothing, useStyles, useState, toContainer, fromClass, branch } from '../common/component'
import { useDialog } from '../common/modal'
import { inputStyle } from '../common/styles/components'
import { Button } from 'react-bootstrap'

const styles = {
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 35
  },
  inputLabel: props => ({
    color: props.theme === 'light' ? 'black' : 'white',
    fontSize: 15,
    marginBottom: 8
  }),
  fileName: props => ({
    ...inputStyle(props),
    flexGrow: 1,
    height: 30,
  }),
  fileInput: {
    width: 0.1,
    height: 0.1,
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: -1
  },
  browseButton: {
    height: 30,
    marginLeft: 15,
    width: 80,
    padding: 0,
    '& > label': {
      width: 80,
      height: 30,
      paddingTop: 2,
      cursor: 'pointer',
      fontSize: 15
    }
  },
  projectInput: props => ({
    ...inputStyle(props),
    height: 30,
    width: '100%'
  }),

  buttonsContainer: {
    display: 'flex',
    marginTop: 50,
    justifyContent: 'flex-end',
    '& > button:first-child': {
      marginRight: 13
    }
  }
}

const isNextEnabled = props => props.file && props.projectName
const isAnalysing = props => props.formState === 'analysing'
const nothingWhenAnalysing = branch(propEq('formState', 'analysing'), nothing())

const inputLabel = Component(props => <div className={props.classes.inputLabel}>{ props.label }</div>)

const fileName = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('fileName') })))(
  Component.of(<div>{ props.file && props.file.name }</div>)))

const fileInput = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('inputContainer') })),
  reduce(concat, nothing()))([
  fileName,
  Component(props => <input id="file" type="file" className={props.classes.fileInput} onChange={e => props.setFile(e.target.files[0])}/>),
  fromClass(Button).contramap(merge({
    children: <label for="file">Browse</label>,
    className: props.classes.browseButton,
    variant: props.theme === 'light' ? 'outline-primary' : 'secondary' })) ]))

const buttons = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('buttonsContainer') })),
  reduce(concat, nothing()))([
    fromClass(Button).contramap(merge({
      children: 'Cancel',
      variant: props.theme === 'light' ? 'outline-primary' : 'secondary',
      onClick: props.closeModal })),
    fromClass(Button).contramap(merge({
      children: 'Next',
      variant: 'primary',
      disabled: !isNextEnabled(props),
      onClick: () => props.setFormState('analysing') })) ]))

const fileSelector = Component(props => compose(
  fold(props),
  concat(inputLabel.contramap(merge({ label: 'Select an ONNX model to start a project' }))),
  reduce(concat, nothing()))([
    fileInput,
    inputLabel.contramap(merge({ label: 'Name this project' })),
    Component(props => <input className={props.classes.projectInput} onChange={e => props.setProjectName(e.target.value)}/>)]))

export const newProjectDialog = Component(props => compose(
  fold(props),
  useStyles(styles),
  useState('formState', 'setFormState', 'fileSelect'),
  useState('file', 'setFile', null),
  useState('projectName', 'setProjectName', null),
  useDialog({ title: props => isAnalysing(props) ? 'Analyzing' : 'New Project' }),
  reduce(concat, nothing()))([
    nothingWhenAnalysing(fileSelector),
    buttons]))
