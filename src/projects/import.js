import { compose, reduce, concat, map, prop, merge, propEq, always,
  tap, head, path, join, dropLast, split } from 'ramda'
import { Component, fold, nothing, useStyles, useState, toContainer,
  fromClass, branch, fromElement, useRef, useDispatch } from '../common/component'
import { createProject } from '../store/actions/projects'
import { useDialog } from '../common/modal'
import { inputStyle } from '../common/styles/components'
import { Button } from 'react-bootstrap'
import { formatBytes } from '../common/utilities'

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
    display: 'flex',
    alignItems: 'center',
    color: props.theme === 'light' ? 'black' : 'white',
    marginLeft: 15,
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
    display: 'flex',
    height: 30,
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
    },
    '& > button:focus': {
      boxShadow: 'none !important'
    }
  }
}

const isNextEnabled = props => props.file && props.projectName
const isAnalysing = props => props.formState === 'analysing'
const nothingWhenAnalysing = branch(propEq('formState', 'analysing'), nothing())
const nothingWhenNoFile = branch(propEq('file', null), nothing())

const inputLabel = fromElement('div').contramap(props => ({ className: props.classes.inputLabel, children: props.label }))
const fileName = fromElement('div').contramap(props => ({ className: props.classes.fileName, children: `${props.file.name} (${formatBytes(props.file.size)})` }))

const fileInput = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('inputContainer') })),
  reduce(concat, nothing()))([
  fromElement('input').contramap(always({
    id: 'newProjectFileInput', type: 'file', accept: '.onnx', className: props.classes.fileInput,
    onChange: compose(
      tap(() => { props.projectNameInput.current.focus(); props.projectNameInput.current.select(); }),
      tap(props.setProjectName),
      join('.'),
      dropLast(1),
      split('.'),
      prop('name'),
      tap(props.setFile),
      head,
      path(['target', 'files'])) })),
  fromClass(Button).contramap(always({
    children: fromElement('label').contramap(always({ for: 'newProjectFileInput', children: 'Browse' })).fold({}),
    className: props.classes.browseButton,
    variant: props.theme === 'light' ? 'outline-primary' : 'secondary' })),
    nothingWhenNoFile(fileName) ]))

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
      onClick: () => props.formState === 'fileSelect' ?
        props.setFormState('analysing') : (props.closeModal(), props.dispatch(createProject({ name: props.projectName }))) })) ]))

const fileSelector = Component(props => compose(
  fold(props),
  concat(inputLabel.contramap(merge({ label: 'A ONNX model is required to start' }))),
  reduce(concat, nothing()))([
    fileInput,
    inputLabel.contramap(merge({ label: 'Name this project' })),
    fromElement('input').contramap(always({
      ref: props.projectNameInput,
      className: props.classes.projectInput,
      value: props.projectName,
      onChange: e => props.setProjectName(e.target.value)
    }))]))

export const newProjectDialog = Component(props => compose(
  fold(props),
  useDispatch,
  useStyles(styles),
  useState('formState', 'setFormState', 'fileSelect'),
  useState('file', 'setFile', null),
  useState('projectName', 'setProjectName', null),
  useRef('projectNameInput'),
  useDialog({ title: props => isAnalysing(props) ? 'Analyzing' : 'New Project' }),
  reduce(concat, nothing()))([
    nothingWhenAnalysing(fileSelector),
    buttons]))
