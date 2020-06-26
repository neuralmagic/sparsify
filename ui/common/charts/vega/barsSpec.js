/**
 * Vega chart specification for a bars chart
 * @see https://vega.github.io/vega/docs/
 */
export default ({
  color = 'steelblue', hoverColor = '#D47C3A',
  dataSet = 'values',
  xField = 'time', yField = 'value',
  width = 270, height = 160 }) => ({
  width,
  height,
  padding: 5,
  autosize: {
    resize: true
  },
  data:    [{ name: dataSet }],
  signals: [
    {
      name: 'tooltip',
      value: {},
      on: [
        { events: 'rect:mouseover', update: 'datum' },
        { events: 'rect:mouseout',  update: '{}' }
      ]
    }
  ],

  scales: [
    {
      name: 'xscale',
      type: 'band',
      domain: { data: dataSet, field: xField },
      range: 'width',
      padding: 0.05,
      round:   true
    },
    {
      name: 'yscale',
      domain: { data: dataSet, field: yField },
      nice: true,
      range: 'height'
    }
  ],

  axes: [{ orient: 'bottom', scale: 'xscale' }],

  marks: [
    {
      type: 'rect',
      from: { data: dataSet },
      encode: {
        enter: {
          x: { scale: 'xscale', field: xField },
          width: { scale: 'xscale', band: 1 },
          y: { scale: 'yscale', field: yField },
          y2: { scale: 'yscale', value: 0 }
        },
        update: {
          fill: { value: color }
        },
        hover: {
          fill: { value: hoverColor }
        }
      }
    },
    {
      type:   'text',
      encode: {
        enter: {
          align: { value: 'center' },
          baseline: { value: 'bottom' },
          fill: { value: '#333' }
        },
        update: {
          x: { scale: 'xscale', signal: `tooltip.${xField}`, band: 0.5 },
          y: { scale: 'yscale', signal: `tooltip.${yField}`, offset: -2 },
          text: { signal: `tooltip.${yField}` },
          fillOpacity: [
            { test: 'datum === tooltip', value: 0 },
            { value: 1 }
          ]
        }
      }
    }
  ]
})
