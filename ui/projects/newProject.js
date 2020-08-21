import React from 'react'
import { compose, reduce, concat, map, merge, nth, prop, tap, when, last,
  head, path, always, propEq, T, cond, equals, not, isNil, split, isEmpty,
  all, props, either, defaultTo } from 'ramda'
import { Component, fold, nothing, contramap, branch, buildComponentWithChildren,
  useStyles, useState, toContainer, fromElement, fromClass } from '../common/component'
import { useTheme, paper, stepLabel, step, stepper,
  button, typography, textField, circularProgress } from '../common/materialui'
import { selectModelIcon, deploymentProfileIcon, nameProjectIcon, arrowRightIcon, arrowLeftIcon } from '../common/icons'
import { formatBytes } from '../common/utilities'
import StepConnector from '@material-ui/core/StepConnector'
import CloseIcon from '@material-ui/icons/Close'
import { FileDrop } from 'react-file-drop'

const fileDrop = buildComponentWithChildren(FileDrop)

const styles = {
  root: {
    width: 750,
    height: 490,
    padding: '30px 0px 30px 0px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  title: {
    fontSize: '22px!important',
    paddingLeft: '40px!important',
    marginBottom: '20px!important'
  },
  stepLabelRoot: {
    marginTop: '5px!important'
  },
  activeStepLabel: props => ({
    color: `${props.theme.palette.primary.main}!important`
  }),
  completedStepLabel: props => ({
    color: `${props.theme.palette.primary.main}!important`
  }),
  activeStepConnector: props => ({
    '& .MuiStepConnector-line': {
      backgroundColor: props.theme.palette.primary.main
    }
  }),
  completedStepConnector: props => ({
    '& .MuiStepConnector-line': {
      backgroundColor: props.theme.palette.primary.main
    }
  }),
  stepperRoot: {
    padding: '0!important',
    '& .MuiStep-root:first-child': {
      flex: 0.5,
      '& .MuiStepLabel-iconContainer': {
        visibility: 'hidden'
      }
    },
    '& .MuiStep-root:nth-child(2)': {
      '& .MuiStepConnector-root': {
        left: '-100px!important',
      }
    },
    '& .MuiStep-root:last-child': {
      flex: 0.5,
      '& .MuiStepLabel-iconContainer': {
        visibility: 'hidden'
      },
      '& .MuiStepConnector-root': {
        left: '-100px!important',
        right: '0px!important'
      }
    }
  },
  stepConnectorLine: props => ({
    height: 4,
    border: 0,
    backgroundColor: props.theme.disabledColor,
    borderRadius: 1,
    borderWidth: '0px!important'
  }),
  stepConnectorAlternativeLabel: {
    top: '20px!important'
  },
  stepContentRoot: {
    flexGrow: 1,
    paddingTop: 40,
    paddingLeft: 40,
    paddingRight: 40
  },
  buttonBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: 40,
    marginBottom: 20
  },
  nextButtonRoot: {
    padding: '6px 15px!important',
    textTransform: 'none!important'
  },
  nextButtonText: {
    color: 'white'
  },
  nextButtonIcon: {
    marginLeft: '2px!important',
    '& svg': {
      fontSize: '13px!important'
    }
  },
  backButtonRoot: {
    padding: '6px 15px!important',
    textTransform: 'none!important'
  },
  backButtonIcon: {
    marginRight: '2px!important',
    '& svg': {
      fontSize: '13px!important'
    }
  },
  cancelButtonRoot: {
    textTransform: 'none!important'
  }
}

const selectModelStyles = {
  fileInput: {
    width: 0.1,
    height: 0.1,
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: -1
  },
  fileDrop: {
    flexGrow: 1
  },
  targetFileDrop: {
    flexGrow: 1
  },
  draggingOverFileDrop: props => ({
    '& .MuiButtonBase-root': {
      border: `2px solid ${props.theme.palette.primary.main}!important`
    }
  }),
  fileInputsContainer: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    position: 'relative'
  },
  fileInputButton: props => ({
    textTransform: 'none!important',
    height: '55px!important',
    fontWeight: 'normal!important',
    fontSize: '1rem!important',
    minWidth: '300px!important',
    padding: '0px!important',
    flexGrow: 1,
    width: '100%!important',
    justifyContent: 'flex-start!important',
    border: !!props.file ? `2px solid ${props.theme.palette.primary.main}!important` : `1px solid ${props.theme.disabledColor}!important`,
    '&:hover': {
      border: `2px solid ${props.theme.palette.primary.main}!important`
    }
  }),
  fileInputLabel: {
    display: 'flex',
    flexGrow: 1,
    lineHeight: '55px',
    paddingLeft: 15
  },
  orText: {
    marginLeft: '20px!important',
    marginRight: '20px!important',
    lineHeight: '55px!important',
    flexGrow: 0
  },
  pathInputRoot: {
    flexGrow: 1,
    width: '100%!important'
  },
  removeFileButton: props => ({
    position: 'absolute!important',
    color: props.theme.palette.primary.main,
    right: 0,
    height: '100%!important'
  })
}

const nameProjectStyles = {
  projectInputsContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  projectNameTextField: {
    marginTop: '20px!important',
    marginBottom: '20px!important'
  }
}

const deploymentProfileStyles = {
  deploymentProfileInputsContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 30
  },
  batchSizeInput: {
    width: '100px!important',
    marginLeft: '20px!important'
  },
  coresInput: {
    width: '100px!important',
    marginLeft: '20px!important',
    marginRight: '20px!important'
  }
}

const stepIconStyles = {
  icon: props => ({
    width: '46px!important',
    height: '46px!important',
    background: 'white',
    zIndex: 1,
    '& path': {
      fill: props.completed || props.active ? props.theme.palette.primary.main : props.theme.disabledColor
    },
    '& circle': {
      stroke: props.completed || props.active ? props.theme.palette.primary.main : props.theme.disabledColor,
      strokeWidth: '2px!important'
    }
  })
}

const computingStyles = {
  computingContainer: {
    marginTop: 50,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}

const stepLabels = ['', 'Select Model', 'Name Project', 'Deployment Profile', '']
const nothingWhenAtFirstStep = branch(propEq('activeStep', 1), nothing())
const nothingWhenAtFourthStep = branch(propEq('activeStep', 4), nothing())
const nothingWhenFileIsSelected = branch(compose(not, isNil, prop('file')), nothing())
const nothingWhenNoFileAndNoPath = branch(compose(all(either(isNil, isEmpty)), props(['file', 'serverPath'])), nothing())
const nothingWhenServerPathIsNotEmpty = branch(compose(not, either(isNil, isEmpty), prop('serverPath')), nothing())

const fileInput = Component(props => compose(
  fold(props),
  fileDrop({
    onDrop: files => when(
        compose(equals('onnx'), last, split('.'), prop('name')),
        compose(props.setProjectName, head, split('.'), prop('name'), tap(props.setFile)))(
        files[0]),
    className: props.classes.fileDrop,
    targetClassName: props.classes.targetFileDrop,
    draggingOverTargetClassName: props.classes.draggingOverFileDrop
  }),
  reduce(concat, nothing()))([
  fromElement('input').contramap(always({
    id: 'newProjectFileInput',
    type: 'file',
    accept: '.onnx',
    className: props.classes.fileInput,
    value: '',
    onChange: compose(
      props.setFile,
      tap(compose(props.setProjectName, head, split('.'), prop('name'))),
      head,
      path(['target', 'files'])) })),
  button({ className: props.classes.fileInputButton }, fromElement('label').contramap(always({
    htmlFor: 'newProjectFileInput',
    className: props.classes.fileInputLabel,
    children: props.file ? `${props.file.name} (${formatBytes(props.file.size)})` : 'Click to browse or drag file here' })).fold({})) ]))

const selectModelStep = Component(props => compose(
  fold(props),
  concat(typography({}, 'Select the ONNX model to load and name the project')),
  map(toContainer({ className: prop('fileInputsContainer') })),
  reduce(concat, nothing()))([
  nothingWhenServerPathIsNotEmpty(fileInput),
  nothingWhenServerPathIsNotEmpty(nothingWhenFileIsSelected(typography(props => ({ className: props.classes.orText }), 'or'))),
  nothingWhenFileIsSelected(textField.contramap(props => ({
    className: props.classes.pathInputRoot,
    value: defaultTo('', props.serverPath),
    onChange: e => props.setServerPath(e.target.value),
    variant: 'outlined',
    label: 'Remote server path' }))),
  nothingWhenNoFileAndNoPath(button({
    className: props.classes.removeFileButton,
    onClick: () => { props.setFile(null); props.setServerPath(null) } },
    fromClass(CloseIcon).fold({})))]))

const nameProjectStep = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('projectInputsContainer') })),
  reduce(concat, nothing()))([
  typography({}, 'Name and describe this project'),
  textField.contramap(props => ({
    className: props.classes.projectNameTextField,
    variant: 'outlined',
    label: 'Project Name',
    autoFocus: true,
    onFocus: e => e.target.select(),
    defaultValue: props.projectName,
    onChange: event => props.setProjectName(event.target.value)
  })),
  textField.contramap(always({
    variant: 'outlined',
    label: 'Description',
    multiline: true,
    rows: 5
  }))]))

const deploymentProfileStep = Component(props => compose(
  fold(props),
  concat(typography({}, 'Describe the deployment profile for the server you will benchmark against')),
  map(toContainer({ className: prop('deploymentProfileInputsContainer') })),
  reduce(concat, nothing()))([
  textField.contramap(always({
    variant: 'outlined',
    label: 'Name',
  })),
  textField.contramap(always({
    className: props.classes.batchSizeInput,
    variant: 'outlined',
    defaultValue: 1,
    label: 'Batch size',
  })),
  textField.contramap(always({
    className: props.classes.coresInput,
    variant: 'outlined',
    label: 'Cores',
  })),
  textField.contramap(always({
    label: 'Instruction set',
    value: 'AVX512, VNNI',
    InputProps: {
      readOnly: true,
      disableUnderline: true
    }
  })) ]))

const completionStep = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('computingContainer') })),
  reduce(concat, nothing()))([
  typography({}, 'Computing benchmarks, please stand by...'),
  circularProgress.contramap(always({}))]))

const stepIcon = Component(props => compose(
  fold(props),
  useTheme,
  useStyles(stepIconStyles),
  contramap(props => ({ className: props.classes.icon })),
  nth(props.icon - 1))([
  selectModelIcon,
  selectModelIcon,
  deploymentProfileIcon,
  nameProjectIcon,
  selectModelIcon
]))

const newProjectStepper = Component(props => compose(
  fold(merge(props, { customRenderer: true })),
  stepper({
    alternativeLabel: true,
    activeStep: props.activeStep,
    classes: {
      root: props.classes.stepperRoot
    },
    connector: <StepConnector classes={{
      alternativeLabel: props.classes.stepConnectorAlternativeLabel,
      active: props.classes.activeStepConnector,
      completed: props.classes.completedStepConnector,
      line: props.classes.stepConnectorLine
    }}/> }),
  reduce(concat, nothing()),
  map(compose(
    step({ }),
    stepLabel({
      classes: {
        label: props.classes.stepLabelRoot,
        active: props.classes.activeStepLabel,
        completed: props.classes.completedStepLabel },
      StepIconComponent: stepIcon.fold }))))(
  stepLabels))

const cancelButton = Component(props => compose(
  fold(props),
  button({
    onClick: () => props.setNewProjectModalOpen(false),
    classes: { root: props.classes.cancelButtonRoot },
    size: 'large'
  }))(
  'Cancel'))

const backButton = Component(props => compose(
  fold(props),
  nothingWhenAtFirstStep,
  nothingWhenAtFourthStep,
  button({
    disabled: props.activeStep === 1,
    size: 'large',
    startIcon: arrowLeftIcon.fold({}),
    onClick: () => props.setActiveStep(--props.activeStep),
    classes: {
      root: props.classes.backButtonRoot,
      label: props.classes.backButtonText,
      startIcon: props.classes.backButtonIcon
    }
  }))(
  'Back'))

const nextButton = Component(props => compose(
  fold(props),
  button({
    variant: 'contained',
    color: 'secondary',
    size: 'large',
    classes: {
      root: props.classes.nextButtonRoot,
      label: props.classes.nextButtonText,
      endIcon: props.classes.nextButtonIcon
    },
    disabled:
      props.activeStep === 1 && isNil(props.file) && either(isNil, isEmpty)(props.serverPath) ||
      props.activeStep === 2 && isEmpty(props.projectName) ||
      props.activeStep === 4,
    endIcon: arrowRightIcon.fold({}),
    onClick: () => props.setActiveStep(++props.activeStep)
  }),
  cond([
    [equals(3), always('Run Profile')],
    [equals(4), always('Open Project')],
    [T, always('Next')]]))(
  props.activeStep))

const buttons = Component(props => compose(
  fold(props),
  map(toContainer({ className: props.classes.buttonBar })),
  reduce(concat, nothing()))([
  cancelButton,
  backButton,
  nextButton ]))

const currentContent = Component(props => compose(
  fold(props),
  useStyles(nameProjectStyles),
  useStyles(selectModelStyles),
  useStyles(deploymentProfileStyles),
  useStyles(computingStyles),
  map(toContainer({ className: props.classes.stepContentRoot })),
  nth(props.activeStep))([
  nothing(),
  selectModelStep,
  nameProjectStep,
  deploymentProfileStep,
  completionStep ]))

export default Component(props => compose(
  fold(props),
  useState('activeStep', 'setActiveStep', 1),
  useState('file', 'setFile', null),
  useState('serverPath', 'setServerPath', null),
  useState('projectName', 'setProjectName', null),
  useTheme,
  useStyles(styles),
  paper(props => ({ elevation: 5, className: props.classes.root })),
  reduce(concat, nothing()))([
  typography(props => ({ className: props.classes.title }), 'New Project Setup'),
  newProjectStepper,
  currentContent,
  buttons ]))
