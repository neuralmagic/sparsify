import { mergeAll, when, is, of, reduce, concat, map, compose, merge } from 'ramda'
import React from 'react';
import { Route, BrowserRouter, HashRouter } from 'react-router-dom'
import { Component, nothing, fromClass } from './component'
import queryString from 'query-string'

const useRoute = paths => c => compose(
  reduce(concat, nothing()),
  map(path => Component(props =>
    <Route path={path}>
        {({ match, location }) =>
            match ? c.fold(mergeAll([props, match.params, queryString.parse(location.search)])) : null}
    </Route>)),
  when(is(String), of))(
  paths)

const useBrowserRouter = c => fromClass(BrowserRouter).contramap(props =>
  merge(props, { children: c.fold(props) }))

const useHashRouter = c => fromClass(HashRouter).contramap(props =>
  merge(props, { children: c.fold(props) }))

export {
  useRoute,
  useBrowserRouter,
  useHashRouter
}
