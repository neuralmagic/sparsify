import { mergeAll, when, is, of, reduce, concat, map, compose, merge, curry, mergeRight } from 'ramda'
import queryString from 'query-string'
import React from 'react'
import { Route, BrowserRouter, HashRouter, Redirect, useHistory as reactRouterUseHistory } from 'react-router-dom'
import { Component, nothing, fromClass } from './component'

export const useRoute = curry((paths, c) => compose(
  reduce(concat, nothing()),
  map(path => Component(props =>
    <Route path={path} exact>
      {({ match, location }) =>
        match ? c.fold(mergeAll([props, match.params, queryString.parse(location.search)])) : null}
    </Route>)),
  when(is(String), of))(
  paths))

export const useRedirect = curry((path, cond, c) => Component(props =>
  <Route>
    {() => cond(props) ? <Redirect to={{ pathname: path }}/> : c.fold(props)}
  </Route>))

export const useHistory = c => {
  const history = reactRouterUseHistory()

  return c.contramap(mergeRight({ history }))
}

export const useBrowserRouter = c => fromClass(BrowserRouter).contramap(props =>
  merge(props, { children: c.fold(props) }))

export const useHashRouter = c => fromClass(HashRouter).contramap(props =>
  merge(props, { children: c.fold(props) }))
