/**
 * Vega chart specification for epoch scheduler chart in Studio
 * @see https://vega.github.io/vega/docs/
 */
import { verticalLinearGradient } from './utils'

export default ({
  data, backgroundColor, epochBackgroundGradient,
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
      tickSize: 5,
      grid: false,
      tickCount: 3,
      labelColor,
      encode: {
        ticks: {
          enter: { stroke: { value: backgroundColor } }
        },
        labels: {
          enter: {
            font: { value: 'OpenSans-Regular' },
            fontSize: { value: 8 }
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
          x: { offset: -35 },
          y: { scale: 'yscale', field: 'id', offset: 6 },
          fill: { value: labelColor },
          text: { field: 'shortLabel' },
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
