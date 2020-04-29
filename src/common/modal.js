import React from 'react'
import { Image } from 'react-bootstrap'
import { concat, compose, curry, propEq, prop, map, merge, mergeRight, always, ifElse, is, identity, applyTo, __ } from 'ramda'
import { Component, useState, branch, nothing, fold, toContainer, useStyles, contramap, fromClass } from './component'

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 'inherit',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '20vh'
  },
  dialogContentContainer: props => ({
    backgroundColor: props.theme === 'dark' ? '#373B40' : 'white',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    padding: 30
  }),
  dialogHeader: props => ({
    padding: 30,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: props.theme === 'dark' ? '#545960' : '#F8F8F8',
    borderBottom: `1px solid ${props.theme === 'dark' ? '#2E3135' : '#DDDDDD'}`,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    display: 'flex',
    alignItems: 'center',
    '& > img' : {
      cursor: 'pointer'
    }
  }),
  headerTitle: props => ({
    color: props.theme === 'dark' ? 'white' : '#495057',
    fontSize: 22,
    flexGrow: 1
  }),
  modalDialog: {
    minWidth: 500,
    boxShadow: '2px 2px 15px rgba(0, 0, 0, 0.6)',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3
  }
}

const image = fromClass(Image).contramap(merge({ alt: 'image' }))

const overlay = modal => Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('overlay' )})))(
  modal))

export const useModal = curry((name, modal, c) => {
  const nothingIfModalNotShown = branch(propEq(`${name}ModalShow`, false), nothing())

  return compose(
    useStyles(modalStyles),
    useState(`${name}ModalShow`, `set${name}ModalShow`, false),
    concat(__, compose(
      nothingIfModalNotShown,
      overlay,
      contramap(props => merge(props, { closeModal: () => props[`set${name}ModalShow`](false) })))(
      modal)))(
    c)
})

const dialogHeader = Component(props => compose(
  fold(props),
  map(toContainer({ className: prop('dialogHeader') })),
  concat(__, image.contramap(always({ src: 'assets/close.svg', onClick: props.closeModal }))))(
  Component(props => <div className={props.classes.headerTitle}>{ props.title }</div>)))

export const useDialog = curry(({ title }, c) => compose(
  map(toContainer({ className: prop('modalDialog') })),
  concat(dialogHeader.contramap(props => mergeRight(props, { title: ifElse(is(String), identity, applyTo(props))(title) }))),
  map(toContainer({ className: prop('dialogContentContainer') })))(
  c))
