import React, {
  createElement, useState as reactUseState,
  useContext as reactUseContext, useReducer,
  useEffect as reactUseEffect, useRef as reactUseRef
} from 'react'
import {
  compose, curry, reject, isNil, always,
  when, is, mergeDeepRight,
  objOf, unless, either, merge, __, mergeRight, has
} from 'ramda';
import { createUseStyles, ThemeProvider, useTheme as jssUseTheme, JssProvider } from 'react-jss'
import { Provider, useSelector as reduxUseSelector, useDispatch as reduxUseDispatch } from 'react-redux'
import { fold } from './fp'

const asArray = x => Array.isArray(x) ? x : Array.of(x)

export { fold }
export const classToFn = C => props => <C {...props}/>

export const buildComponentWithChildren = curry((Comp, settings, c) =>
  Component(props => compose(
    fold(props),
    fromClass(Comp).contramap,
    always,
    merge(settings),
    objOf('children'),
    when(has('fold'), fold(props)))(
    c)))

const withDevTools = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__

let devTools

if (withDevTools) {
  const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__

  devTools = reduxDevTools.connect({ name: 'neuralmagic-recall' })
}

export const useThunkReducer = (reducer, initialState) => {
  let enhancedReducer = (state, action) => {
    const newState = reducer(state, action)

    devTools && devTools.send(action, newState)

    return newState
  }

  const [state, dispatch] = useReducer(enhancedReducer, initialState)

  const thunkDispatch = action => {
    if (typeof action === 'function') {
      return action(thunkDispatch, state)
    }

    return dispatch(action)
  }

  return [state, thunkDispatch]
}

export const withContextProvider = (Context, reducer, initialState) => c => {
  const [state, dispatch] = useThunkReducer(reducer, initialState);

  return fromClass(Context.Provider).contramap(props => ({
    children: c.fold(merge(props, { dispatch })),
    value:    { ...state, dispatch }
  }))
}

export const useStoreProvider = curry((store, c) =>
  <Provider store={store}>{ c }</Provider>)

export const useSelector = curry((name, fn, c) => {
  const value = reduxUseSelector(fn)

  return c.contramap(mergeRight({ [name]: value }))
})

export const useDispatch = c => {
  const dispatch = reduxUseDispatch()

  return c.contramap(mergeRight({ dispatch }))
}

export const useContext = context => c => {
  const data = reactUseContext(context)

  return c.contramap(merge(__, { ...data }))
}

export const useState = (name, updateFn, initialValue) => c => {
  const [value, updater] = reactUseState(initialValue)

  return c.contramap(merge(__, {
    [name]:     value,
    [updateFn]: updater
  }))
}

export const useEffect = (updateFn, dependants) => c => Component(props => {
  reactUseEffect(() => updateFn(props), dependants)

  return c.fold(props)
})

export const useRef = curry((name, c) => {
  const ref = reactUseRef(null)

  return c.contramap(mergeRight({
    [name]: ref
  }))
})

export const useStyles = curry((styles, c) =>
  c.contramap(props => mergeDeepRight(props, { classes: createUseStyles(styles)(props) })))

export const withTheme = curry((theme, c) => Component(props => compose(
  fold(props),
  contramap(merge({
    children: c.fold(props),
    theme
  })))(
  fromClass(ThemeProvider))))

export const useJssProvider = curry((settings, c) => Component(props => compose(
  fold(props),
  contramap(merge({
    children: c.fold(props),
    ...settings
  })))(
  fromClass(JssProvider))))

export const useTheme = c => Component(props => {
  const theme = jssUseTheme()

  return c.fold(merge(props, { theme }))
})

export const branch = curry((condition, left, right) =>
  Component(props =>
    condition(props) ? left.fold(props) : right.fold(props)))

const ComponentRenderer = ({ props, g }) => compose(reject(isNil), g)(props)

export const Component = compose(
  g => ({
    g,
    map:       f => Component(x => f(g(x), x)),
    contramap: f => Component(x => g(f(x))),
    concat:    other => Component(x => g(x).concat(other.g(x))),
    fold: props => <ComponentRenderer props={props} g={g}/>
  }),
  x => compose(asArray, x))

export const contramap = curry((f, c) => c.contramap(f))

// of :: JSX -> Component
Component.of = compose(Component, always)

export const fromClass   = compose(Component, classToFn)
export const fromElement = type => Component(props => React.createElement(type, props))
export const nothing     = () => Component.of(null)
export const toContainer = compose(
  s => (c, props) =>
    createElement(s.tag || 'div', compose(
      when(always(s.attributes), merge(s.attributes)),
      when(always(s.onScroll),     merge({ onScroll: e => s.onScroll(props, e) })),
      when(always(s.onMouseEnter), merge({ onMouseEnter: e => s.onMouseEnter(props, e) })),
      when(always(s.onClick),      merge({ onClick: e => s.onClick(props, e) })))({
      className: unless(either(is(String), isNil), classFn => classFn(props.classes))(s.className),
      ref: s.ref || props && props.ref,
      style: s.style
    }),
    c),
  when(is(String), objOf('className')))

export const toTooltipContainer = ({ id, place }) => c =>
  Component(props => <div data-tip data-for={id} data-place={place}>{ c.fold(props) }</div>)
