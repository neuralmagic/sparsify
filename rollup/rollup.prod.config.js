import babel from 'rollup-plugin-babel'
import html from 'rollup-plugin-html-bundle'
import commonJS from 'rollup-plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import { terser } from 'rollup-plugin-terser'
import replace from 'rollup-plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import json from 'rollup-plugin-json'
import copy from 'rollup-plugin-copy'
import * as react from 'react'
import * as reactDom from 'react-dom'
import * as reduxSagaEffects from 'redux-saga/effects'
import * as reactIs from 'react-is'
import * as propTypes from 'prop-types'
import css from 'rollup-plugin-css-only'
import * as vega from 'vega'
import * as vegaLite from 'vega-lite'

export default {
  input:  'ui/index.js',
  output: {
    file:   'static/main.min.js',
    format: 'iife'
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    html({
      template: 'ui/template.html',
      target: 'static/index.html'
    }),
    css({ output: 'static/bundle.css' }),
    resolve({
      mainFields: ['browser', 'jsnext', 'main']
    }),
    json(),
    commonJS({
      include:      ['node_modules/**'],
      exclude:      ['node_modules/process-es6/**'],
      namedExports: {
        react: Object.keys(react),
        'react-dom': Object.keys(reactDom),
        'react-is': Object.keys(reactIs),
        'prop-types': Object.keys(propTypes),
        'node_modules/react-redux/node_modules/react-is/index.js': ['isValidElementType', 'isContextConsumer'],
        'node_modules/react-router/node_modules/react-is/index.js': ['isValidElementType', 'isContextConsumer'],
        'node_modules/react-router-dom/index.js': ['Route', 'Redirect', 'BrowserRouter', 'HashRouter'],
        'node_modules/redux-saga/dist/redux-saga-effects-npm-proxy.cjs.js': Object.keys(reduxSagaEffects),
        'node_modules/d3-format/dist/d3-format.js': ['format'],
        'vegaImport': Object.keys(vega),
        'vegaLiteImport': Object.keys(vegaLite)
      }
    }),
    builtins(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
        '@babel/preset-react'
      ]
    }),
    terser(),
    copy({
      targets: [{ src: 'ui/assets/*', dest: 'static/assets' }]
    })
  ]
}
