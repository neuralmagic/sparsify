import React from 'react'
import { map, compose, propEq, prop, omit, always, merge, reduce,
  concat, not, head, path, prepend, when, __ } from 'ramda'
import { Image } from 'react-bootstrap'
import { Component, fold, toContainer, branch, nothing, useState,
  fromClass, useStyles, fromElement } from './component'
import { useOutsideClick } from './hooks'

export const dropdownMenuStyles = {
  dropdownMenu: {
    display: 'flex',
    flexDirection: 'column',
    zIndex: 9999
  },
  dropdownMenuItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 42,
    fontSize: 14,
    paddingLeft: 5,
    paddingRight: 5,
    color: 'white',
    '&:hover': {
      backgroundColor: '#3E4146'
    }
  },
  dropdownMenuItemLabel: {
    paddingRight: 40
  },
  dropdownMenuItemImageContainer: {
    minWidth: 30,
    display: 'flex',
    justifyContent: 'center'
  },
  fileInput: {
    width: 0.1,
    height: 0.1,
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: -1
  },
  fileInputLabel: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    marginBottom: 0,
    cursor: 'pointer'
  }
}

const nothingIfDropdownContentHidden = branch(propEq('isDropdownContentShown', false), nothing())
const image = fromClass(Image).contramap(merge({ alt: 'image' }))
const isFileSelectItem = propEq('fileSelect', true)
const nothingIfNoFileSelect = branch(compose(not, isFileSelectItem), nothing())

export const useAsDropdownContent = c => Component(props => compose(
  fold(omit(['ref'], props)),
  nothingIfDropdownContentHidden,
  map(toContainer({ className: props.classes.dropdownContent })))(
  c))

export const useAsDropdown = c => Component(props => compose(
  fold(omit(['ref'], props)),
  useOutsideClick(() => props.setIsDropdownContentShown(false)),
  map(toContainer({
    className: prop('dropdown'),
    onClick: props => !props.isDropdownContentShown && props.setIsDropdownContentShown(!props.isDropdownContentShown) })))(
  c))

export const useDropdownState = useState('isDropdownContentShown', 'setIsDropdownContentShown', false)
export const nothingIfNoExtraContent = branch(propEq('extraContent', undefined), nothing())

export const dropdownMenuItem = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('dropdownMenuItem'), onClick: props.onClick })),
  when(always(isFileSelectItem(props)), c =>
    fromElement('label').contramap(props => ({ for: 'dropdownFileSelectInput', className: props.classes.fileInputLabel, children: c.fold(props) }))),
  reduce(concat, nothing()),
  prepend(__, [
    Component(props => <span className={props.classes.dropdownMenuItemLabel}>{props.label}</span>),
    nothingIfNoExtraContent(props.extraContent),
    nothingIfNoFileSelect(fromElement('input').contramap(props => ({
      id: 'dropdownFileSelectInput', type: 'file', accept: props.accept, className: props.classes.fileInput,
      onChange: compose(
        props.onFileSelect(props),
        head,
        path(['target', 'files'])) })))
  ]),
  map(toContainer({ className: prop('dropdownMenuItemImageContainer') })))(
  image.contramap(always({ src: props.icon, width: props.iconWidth, height: props.iconHeight }))))

export const dropdownMenu = Component(props => compose(
  fold(props),
  useStyles(dropdownMenuStyles),
  map(toContainer({ className: prop('dropdownMenu') })),
  reduce(concat, nothing()),
  map(compose(dropdownMenuItem.contramap, merge)))(
  props.items))
