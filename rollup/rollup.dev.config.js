import babel from 'rollup-plugin-babel'
import html from 'rollup-plugin-html-bundle'
import commonJS from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import builtins from 'rollup-plugin-node-builtins'
import json from 'rollup-plugin-json'
import copy from 'rollup-plugin-copy'
import svgr from '@svgr/rollup'
import postcss from 'rollup-plugin-postcss'
import copyAssets from 'postcss-copy-assets'
import * as react from 'react'
import * as reactDom from 'react-dom'
import * as reduxSagaEffects from 'redux-saga/effects'
import * as reactIs from 'react-is'
import * as propTypes from 'prop-types'
import * as vega from 'vega'
import * as vegaLite from 'vega-lite'

export default {
  input:  'ui/index.js',
  output: {
    file:   'neuralmagic_studio/static/main.min.js',
    format: 'iife',
  },
  plugins: [
    svgr(),
    json(),
    builtins(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
        '@babel/preset-react'
      ]
    }),
    html({
      template: 'ui/template.html',
      target: 'neuralmagic_studio/static/index.html'
    }),
    postcss({
      plugins: [
        copyAssets({ base: 'neuralmagic_studio/static' })
      ],
      to: 'neuralmagic_studio/static/bundle.css'
    }),
    resolve({
      mainFields: ['browser', 'jsnext', 'main']
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
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
        'node_modules/react-router-dom/index.js': ['Route', 'Redirect', 'BrowserRouter', 'HashRouter', 'useHistory'],
        'node_modules/redux-saga/dist/redux-saga-effects-npm-proxy.cjs.js': Object.keys(reduxSagaEffects),
        'node_modules/d3-format/dist/d3-format.js': ['format'],
        'node_modules/@material-ui/core/styles/index.js': ['ThemeProvider', 'createMuiTheme', 'useTheme', 'makeStyles'],
        'vegaImport': Object.keys(vega),
        'vegaLiteImport': Object.keys(vegaLite)
      }
    }),
    copy({
      targets: [{ src: 'ui/assets/*', dest: 'neuralmagic_studio/static/assets' }]
    }),
    serve({
      open:        true,
      contentBase: 'neuralmagic_studio/static'
    })
  ]
}
