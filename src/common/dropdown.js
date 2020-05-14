import React from 'react'
import { map, compose, propEq, prop, omit, always, merge, reduce, concat, __ } from 'ramda'
import { Component, fold, toContainer, branch, nothing, useState, fromClass, useStyles } from './component'
import { Image } from 'react-bootstrap'
import { useOutsideClick } from './hooks'

const nothingIfDropdownContentHidden = branch(propEq('isDropdownContentShown', false), nothing())
const image = fromClass(Image).contramap(merge({ alt: 'image' }))

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
  }
}

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
    onClick: props => props.setIsDropdownContentShown(!props.isDropdownContentShown) })))(
  c))

export const useDropdownState = useState('isDropdownContentShown', 'setIsDropdownContentShown', false)
export const nothingIfNoExtraContent = branch(propEq('extraContent', undefined), nothing())

export const dropdownMenuItem = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('dropdownMenuItem'), onClick: props.onClick })),
  concat(__, nothingIfNoExtraContent(props.extraContent)),
  concat(__, Component(props => <span className={props.classes.dropdownMenuItemLabel}>{props.label}</span>)),
  map(toContainer({ className: prop('dropdownMenuItemImageContainer') })))(
  image.contramap(always({ src: props.icon, width: props.iconWidth, height: props.iconHeight }))
  ))

export const dropdownMenu = Component(props => compose(
  fold(props),
  useStyles(dropdownMenuStyles),
  map(toContainer({ className: prop('dropdownMenu') })),
  reduce(concat, nothing()),
  map(compose(dropdownMenuItem.contramap, merge)))(
  props.items))
