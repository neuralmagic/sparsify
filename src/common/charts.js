import React from 'react'
import { Vega } from 'react-vega'
import { compose, map, concat } from 'ramda'
import {
  Component,
  fromClass,
  toContainer,
  injectStyleSheet
} from './component'

const styles = {
    title: { color: 'white' }
}

export const timebarChartSpec = ({
    data,
    xField = 'time', yField = 'value',
    yTitle,
    mark = 'bar',
    nominalField,
    xDomain,
    yDomain,
    width = 270, height = 160 }) => ({
    width,
    height,
    padding: 5,
    view: { stroke: 'transparent' },
    background: 'black',
    data,
    mark: {
        type: mark,
        tooltip: true,
        line: {
            color: '#5D82A6'
          },
          'color': {
            x1: 1,
            y1: 1,
            x2: 1,
            y2: 0,
            gradient: 'linear',
            stops: [
              {
                offset: 0,
                color: 'black'
              },
              {
                offset: 1,
                color: '#5D82A6'
              }
            ]
          }
    },
    encoding: {
        x: {
            field: xField,
            type: 'temporal',
            timeUnit: 'hoursminutesseconds',
            scale: {type: 'ordinal', domain: xDomain },
            axis: { title: xField, grid: false, domainColor: '#7B7B7B', labelColor: '#7B7B7B' }
        },
        ...(nominalField && {color: {field: nominalField, type: 'nominal', legend: { orient: 'bottom', labelColor: '#7B7B7B' }} }),
        y: {
            field: yField, 
            type: "quantitative",
            scale: { domain: yDomain },
            axis: {
                domainColor: '#7B7B7B', labelColor: '#7B7B7B',
                grid: false,
                minExtent: 40,
                maxExtent: 40,
                ...(yTitle && { title: yTitle })
            }
        }
    }
})

export const barChartSpec = ({
    color = 'steelblue', hoverColor = '#D47C3A',
    dataSet = 'values',
    xField = 'time', yField = 'value',
    width = 270, height = 160 }) => ({
    width,
    height,
    'padding': 5,
    autosize: {
        "resize": true
    },
    'data':    [{ 'name': dataSet }],
    'signals': [
        {
            'name':  'tooltip',
            'value': {},
            'on':    [
                { 'events': 'rect:mouseover', 'update': 'datum' },
                { 'events': 'rect:mouseout',  'update': '{}' }
            ]
        }
    ],

    'scales': [
        {
            'name':    'xscale',
            'type':    'band',
            'domain':  { 'data': dataSet, 'field': xField },
            'range':   'width',
            'padding': 0.05,
            'round':   true
        },
        {
            'name':   'yscale',
            'domain': { 'data': dataSet, 'field': yField },
            'nice':   true,
            'range':  'height'
        }
    ],

    'axes': [{ 'orient': 'bottom', 'scale': 'xscale' }],

    'marks': [
        {
            'type':   'rect',
            'from':   { 'data': dataSet },
            'encode': {
                'enter': {
                    'x':     { 'scale': 'xscale', 'field': xField },
                    'width': { 'scale': 'xscale', 'band': 1 },
                    'y':     { 'scale': 'yscale', 'field': yField },
                    'y2':    { 'scale': 'yscale', 'value': 0 }
                },
                'update': {
                    'fill': { 'value': color }
                },
                'hover': {
                    'fill': { 'value': hoverColor }
                }
            }
        },
        {
            'type':   'text',
            'encode': {
                'enter': {
                    'align':    { 'value': 'center' },
                    'baseline': { 'value': 'bottom' },
                    'fill':     { 'value': '#333' }
                },
                'update': {
                    'x':           { 'scale': 'xscale', 'signal': `tooltip.${xField}`, 'band': 0.5 },
                    'y':           { 'scale': 'yscale', 'signal': `tooltip.${yField}`, 'offset': -2 },
                    'text':        { 'signal': `tooltip.${yField}` },
                    'fillOpacity': [
                        { 'test': 'datum === tooltip', 'value': 0 },
                        { 'value': 1 }
                    ]
                }
            }
        }
    ]
})

export const pieChartSpec = {
    'width':   170,
    'height':  170,
    'padding': 5,
    'data':    [{
        'name':      'table',
        'transform': [{
            'type':  'pie',
            'field': 'value'
        }]
    }],
    'scales': [
        {
            'name':   'color',
            'type':   'ordinal',
            'domain': { 'data': 'table', 'field': 'id' },
            'range':  [ '#719AD2', '#84AC50', '#EEBF2D', '#516833' ]
        },
        {
            'name':   'name',
            'type':   'ordinal',
            'domain': { 'data': 'table', 'field': 'name' },
            'range':  [ '#719AD2', '#84AC50', '#EEBF2D', '#516833' ]
        },
        {
            'name':   'r',
            'type':   'sqrt',
            'domain': { 'data': 'table', 'field': 'value' },
            'zero':   true,
            'range':  [78, 78]
        }
    ],

    'legends': [{
        'orient': 'right',
        'fill':   'name',
        'encode': {
            'symbols': {
                'update': {
                    'size': { 'value': 64 }
                }
            }
        }
    }],

    'marks': [
        {
            'type':   'arc',
            'from':   { 'data': 'table' },
            'encode': {
                'enter': {
                    'fill': { 'scale': 'color', 'field': 'id' },
                    'x':    { 'signal': 'width / 2' },
                    'y':    { 'signal': 'height / 2' }
                },
                'update': {
                    'fill':         { 'scale': 'color', 'field': 'id' },
                    'startAngle':   { 'field': 'startAngle' },
                    'endAngle':     { 'field': 'endAngle' },
                    'padAngle':     0,
                    'innerRadius':  { value: 40 },
                    'outerRadius':  { 'signal': 'width / 2' },
                    'cornerRadius': 0
                }
            }
        },

        {
            'type':   'text',
            'from':   { 'data': 'table' },
            'encode': {
                'enter': {
                    'x':        { 'field': { 'group': 'width' }, 'mult': 0.5 },
                    'y':        { 'field': { 'group': 'height' }, 'mult': 0.5 },
                    'radius':   { 'scale': 'r', 'field': 'value', offset: -16 },
                    'theta':    { 'signal': '(datum.startAngle + datum.endAngle)/2' },
                    'fill':     { 'value': '#FFF' },
                    'align':    { 'value': 'center' },
                    'baseline': { 'value': 'middle' },
                    'text':     { 'field': 'label' }
                }
            }
        }]
}


const ChartLabel = Component(props =>
  <div className={props.classes.title}>{ props.title }</div>);

export const vegaChart = compose(
  injectStyleSheet(styles),
  map(toContainer({ })),
  concat(ChartLabel),
  fromClass)(
  Vega)
