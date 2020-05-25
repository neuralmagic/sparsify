import React from 'react'
import { Vega } from 'react-vega'
import { compose, map, concat } from 'ramda'
import {
  Component,
  fromClass,
  toContainer
} from './component'

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
      scale: { type: 'ordinal', domain: xDomain },
      axis: { title: xField, grid: false, domainColor: '#7B7B7B', labelColor: '#7B7B7B' }
    },
    ...nominalField && { color: { field: nominalField, type: 'nominal', legend: { orient: 'bottom', labelColor: '#7B7B7B' } } },
    y: {
      field: yField,
      type: 'quantitative',
      scale: { domain: yDomain },
      axis: {
        domainColor: '#7B7B7B', labelColor: '#7B7B7B',
        grid: false,
        minExtent: 40,
        maxExtent: 40,
        ...yTitle && { title: yTitle }
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
    resize: true
  },
  data:    [{ 'name': dataSet }],
  signals: [
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

const verticalLinearGradient = values => ({
  x1: 0,
  x2: 0,
  y1: 0,
  y2: 1,
  gradient: 'linear',
  stops: [
    { offset: 0, color: values[0] },
    { offset: 1, color: values[1] }
  ]
})

export const epochSchedulerSpec = ({
  data, backgroundColor, axesColor, epochBackgroundGradient,
  selectedEpochBackgroundGradient, labelColor, selectedModifier }) => ({
  data: { name: 'epochs', values: data },
  background: backgroundColor,
  scales: [
    {
      name: 'yscale',
      type: 'band',
      range: [0, { signal: 'height' }],
      domain: { data: 'epochs', field: 'id' }
    },
    {
      name: 'xscale',
      type: 'linear',
      range: 'width',
      domain: { data: 'epochs', fields: ['min', 'max'] }
    }
  ],
  axes: [
    {
      orient: 'top',
      scale: 'xscale',
      tickSize: 15,
      grid: true,
      tickCount: 11,
      labelColor,
      encode: {
        grid: {
          update: {
            stroke: { value: axesColor },
            strokeDash: [
              { test: 'datum.index===0', value: [] },
              { test: 'datum.index===1', value: [] },
              { value: [0.7, 1.4] }
            ]
          }
        },
        ticks: {
          enter: {
            stroke: { value: axesColor },
            strokeDash: [
              { test: 'datum.index===0', value: [] },
              { test: 'datum.index===1', value: [] },
              { value: [0.7, 1.4] }
            ]
          }
        },
        labels: {
          enter: {
            font: { value: 'OpenSans-Regular' },
            fontSize: [
              { test: 'datum.index===0', value: 15 },
              { test: 'datum.index===1', value: 15 },
              { value: 8 }]
          }
        }
      }
    }
  ],
  marks: [
    {
      type: 'text',
      from: { data: 'epochs' },
      encode: {
        enter: {
          x: { offset: -25 },
          y: { scale: 'yscale', field: 'id', offset: 6 },
          fill: { value: labelColor },
          text: { field: 'label' },
          fontSize: { value: 10 }
        }
      }
    },
    {
      type: 'rect',
      from: { data: 'epochs' },
      encode: {
        update: {
          x: { scale: 'xscale', field: 'min' },
          x2: { scale: 'xscale', field: 'max' },
          y: { scale: 'yscale', field: 'id' },
          height: { value: 4 },
          fill: [
            { test: `datum.id === "${selectedModifier && selectedModifier.id}"`, value: verticalLinearGradient(selectedEpochBackgroundGradient) },
            { value: verticalLinearGradient(epochBackgroundGradient) }]
        }
      }
    },
    {
      type: 'rect',
      from: { data: 'epochs' },
      encode: {
        enter: {
          x: { scale: 'xscale', field: 'start' },
          x2: { scale: 'xscale', field: 'end' },
          y: { scale: 'yscale', field: 'id' },
          cornerRadius: { value: 2 },
          height: { value: 4 },
          fill: {
            value: {
              x1: 0,
              x2: 0,
              y1: 0,
              y2: 1,
              gradient: 'linear',
              stops: [
                { offset: 0, color: '#A4C0E3' },
                { offset: 1, color: '#6D9CE0' }
              ]
            }
          }
        }
      }
    }
  ]
})

export const layerIndexChartSpec = ({ data, backgroundColor }) => ({
  data: { name: 'layers', values: data },
  background: backgroundColor,
  scales: [
    {
      name: 'sparsityScale',
      type: 'linear',
      range: 'height',
      domain: { data: 'layers', field: 'sparsity' }
    },
    {
      name: 'executionTimeScale',
      type: 'linear',
      range: 'height',
      domain: { data: 'layers', fields: ['denseExecTime', 'sparseExecTime'] }
    },
    {
      name: 'layerScale',
      type: 'linear',
      range: 'width',
      domain: { data: 'layers', field: 'layer' },
      domainMin: 1,
      round: true
    }
  ],
  axes: [
    {
      orient: 'bottom',
      scale: 'layerScale',
      title: 'Layer Index',
      tickMinStep: 1,
      labelColor: 'white',
      titleColor: 'white',
      grid: true
    },
    {
      orient: 'left',
      scale: 'sparsityScale',
      title: 'Layer Sparsity',
      labelColor: 'white',
      titleColor: 'white',
      grid: true,
      tickCount: 10
    },
    {
      orient: 'right',
      scale: 'executionTimeScale',
      title: 'Dense vs Sparse Execution Time',
      labelColor: 'white',
      titleColor: 'white',
      tickCount: 10
    }
  ],
  marks: [{
    type: 'area',
    from: { data: 'layers' },
    encode: {
      enter: {
        x: { scale: 'layerScale', field: 'layer' },
        y: { scale: 'executionTimeScale', field: 'denseExecTime' },
        y2: { scale: 'executionTimeScale', value: 0 },
        fill: { value: '#A3C9FB' },
        fillOpacity: { value: 0.3 }
      }
    }
  }, {
    type: 'area',
    from: { data: 'layers' },
    encode: {
      enter: {
        x: { scale: 'layerScale', field: 'layer' },
        y: { scale: 'executionTimeScale', field: 'sparseExecTime' },
        y2: { scale: 'executionTimeScale', value: 0 },
        fill: { value: '#7485FB' },
        fillOpacity: { value: 0.3 }
      }
    }
  }, {
    type: 'line',
    from: { data: 'layers' },
    encode: {
      enter: {
        x: { scale: 'layerScale', field: 'layer' },
        y: { scale: 'executionTimeScale', field: 'sparseExecTime' },
        stroke: { value: '#7485FB' }
      }
    }
  }, {
    type: 'line',
    from: { data: 'layers' },
    encode: {
      enter: {
        x: { scale: 'layerScale', field: 'layer' },
        y: { scale: 'executionTimeScale', field: 'denseExecTime' },
        stroke: { value: '#A3C9FB' }
      }
    }
  }, {
    type: 'line',
    from: { data: 'layers' },
    encode: {
      enter: {
        x: { scale: 'layerScale', field: 'layer' },
        y: { scale: 'sparsityScale', field: 'sparsity' },
        stroke: { value: '#E19325' }
      }
    }
  }]
})

const ChartLabel = Component(props =>
  <div className={props.classes.title}>{ props.title }</div>);

export const vegaChart = compose(
  map(toContainer({ })),
  concat(ChartLabel),
  fromClass)(
  Vega)
