import { mergeAll, when, is, of as Rof, reduce, concat, map, compose } from 'ramda'
import React from 'react';
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { Component, nothing } from './component'
import queryString from 'query-string'
import { history } from '../store/index'

const toRouteContainer = paths => c => compose(
    reduce(concat, nothing()),
    map(path => Component(props =>
        <Route path={path}>
            {({ match, location }) =>
                match ? c.fold(mergeAll([props, match.params, queryString.parse(location.search)])) : null}
        </Route>)),
    when(is(String), Rof))(
    paths)

const toConnectedRouterContainer = c =>
    Component(props => <ConnectedRouter history={history}>{ c.fold(props) }</ConnectedRouter>)

export {
    toRouteContainer,
    toConnectedRouterContainer
}
