/**
 * Vega chart specification for the layer index chart in Studio
 * @see https://vega.github.io/vega/docs/
 */
import { verticalLinearGradient } from './utils'

export default ({
  data, backgroundColor, axesColor, labelColor, gridColor, titleColor,
  denseAreaColors, denseLineColor, sparseAreaColors, sparseLineColor }) => ({
  data: {
    name: 'layers',
    values: data,
    transform: [
      { type: 'formula', expr: 'datum.sparsity*10000', as: 'sparsityMultiplied' },
      { type: 'formula', expr: 'datum.denseExecTime + 0.5', as: 'denseExecTimeExtended' },
      { type: 'formula', expr: 'datum.sparseExecTime + 0.5', as: 'sparseExecTimeExtended' }] },
  background: backgroundColor,
  scales: [
    {
      name: 'sparsityScale',
      type: 'linear',
      range: 'height',
      nice: true,
      domain: { data: 'layers', field: 'sparsityMultiplied' },
      domainMax: 100
    },
    {
      name: 'executionTimeScale',
      type: 'linear',
      range: 'height',
      domain: { data: 'layers', fields: ['denseExecTimeExtended', 'sparseExecTimeExtended'] }
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
      titleColor,
      titlePadding: 15,
      //grid: true,
      tickSize: 0,
      tickCount: data.length,
      labelPadding: 5,
      labelFontSize: 9,
      labelColor
    },
    {
      orient: 'left',
      scale: 'sparsityScale',
      title: 'Layer Sparsity %',
      titleColor,
      //grid: true,
      tickCount: 11,
      tickSize: 0,
      labelPadding: 10,
      titlePadding: 15,
      labelFontSize: 9,
      labelColor,
      encode: {
        grid: {
          enter: { stroke: { value: gridColor } }
        },
        domain: {
          enter: {
            stroke: { value: 'white' }
          }
        },
        ticks: {
          enter: {
            stroke: { value: 'white' }
          }
        }
      }
    },
    {
      orient: 'right',
      scale: 'executionTimeScale',
      title: 'Dense vs Sparse Execution Time',
      titleColor,
      tickCount: 11,
      tickSize: 0,
      labelPadding: 10,
      titlePadding: 15,
      labelFontSize: 9,
      labelColor,
      encode: {
        grid: {
          enter: { stroke: { value: gridColor } }
        },
        domain: {
          enter: {
            stroke: { value: 'white' }
          }
        },
        ticks: {
          enter: {
            stroke: { value: 'white' }
          }
        }
      }
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
        fill: { value: verticalLinearGradient(denseAreaColors) },
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
        fill: { value: sparseAreaColors[0] },
        fillOpacity: { value: 0.5 }
      }
    }
  }, {
    type: 'line',
    from: { data: 'layers' },
    encode: {
      enter: {
        x: { scale: 'layerScale', field: 'layer' },
        y: { scale: 'executionTimeScale', field: 'sparseExecTime' },
        stroke: { value: sparseLineColor },
        strokeWidth: 1
      }
    }
  }, {
    type: 'line',
    from: { data: 'layers' },
    encode: {
      enter: {
        x: { scale: 'layerScale', field: 'layer' },
        y: { scale: 'executionTimeScale', field: 'denseExecTime' },
        stroke: { value: denseLineColor },
        strokeWidth: 1
      }
    }
  }, {
    type: 'line',
    from: { data: 'layers' },
    encode: {
      enter: {
        x: { scale: 'layerScale', field: 'layer' },
        y: { scale: 'sparsityScale', field: 'sparsityMultiplied' },
        stroke: { value: '#E19325' }
      }
    }
  }, {
    type: 'symbol',
    from: { data: 'layers' },
    interactive: true,
    encode: {
      update: {
        x: { scale: 'layerScale', field: 'layer' },
        y: { scale: 'sparsityScale', field: 'sparsityMultiplied' },
        stroke: { value: '#E19325' },
        fill: { value: 'white' },
        size: { value: 20 }
      },
      hover: {
        size: { value: 90 }
      }
    }
  }],
  signals: [{
    name: 'tooltip',
    value: {},
    on: [
      { events: 'symbol:click', update: 'datum' }
    ]
  }]
})
