import babel from 'rollup-plugin-babel'
import html from 'rollup-plugin-bundle-html'
import commonJS from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import nodeResolve from 'rollup-plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import builtins from 'rollup-plugin-node-builtins'
import json from 'rollup-plugin-json'
import css from 'rollup-plugin-css-only'
import * as react from 'react'
import * as reactDom from 'react-dom'
import * as reactIs from 'react-is'
import * as propTypes from 'prop-types'

export default {
    input:  'src/index.js',
    output: {
        file:   'public/built/main.min.js',
        format: 'iife'
    },
    plugins: [
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
            template: 'src/template.html',
            dest:     'public/built',
            filename: 'index.html'
        }),
        css({ output: 'public/built/bundle.css' }),
        nodeResolve({
            jsnext:  true,
            main:    true,
            browser: true
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
                'node_modules/react-router/node_modules/react-is/index.js': ['isValidElementType', 'isContextConsumer']
            }
        }),
        livereload({
            watch: 'public'
        }),
        serve({
            open:        true,
            contentBase: 'public/built'
        })
    ]
}
