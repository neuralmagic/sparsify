/**
 * Vega chart specification for a pie chart
 * @see https://vega.github.io/vega/docs/
 */
export default {
  width:   170,
  height:  170,
  padding: 5,
  data:    [{
    name: 'table',
    transform: [{
      type: 'pie',
      field: 'value'
    }]
  }],
  scales: [
    {
      name: 'color',
      type: 'ordinal',
      domain: { data: 'table', field: 'id' },
      range:  [ '#719AD2', '#84AC50', '#EEBF2D', '#516833' ]
    },
    {
      name: 'name',
      type: 'ordinal',
      domain: { data: 'table', field: 'name' },
      range: [ '#719AD2', '#84AC50', '#EEBF2D', '#516833' ]
    },
    {
      name: 'r',
      type: 'sqrt',
      domain: { data: 'table', field: 'value' },
      zero: true,
      range: [78, 78]
    }
  ],

  legends: [{
    orient: 'right',
    fill: 'name',
    encode: {
      symbols: {
        update: { size: { value: 64 } }
      }
    }
  }],

  marks: [
    {
      type: 'arc',
      from: { data: 'table' },
      encode: {
        enter: {
          fill: { scale: 'color', field: 'id' },
          x: { signal: 'width / 2' },
          y: { signal: 'height / 2' }
        },
        update: {
          fill: { scale: 'color', field: 'id' },
          startAngle: { field: 'startAngle' },
          endAngle: { field: 'endAngle' },
          padAngle: 0,
          innerRadius: { value: 40 },
          outerRadius: { signal: 'width / 2' },
          cornerRadius: 0
        }
      }
    },
    {
      type: 'text',
      from: { data: 'table' },
      encode: {
        enter: {
          x:        { field: { group: 'width' }, mult: 0.5 },
          y:        { field: { group: 'height' }, mult: 0.5 },
          radius:   { scale: 'r', field: 'value', offset: -16 },
          theta:    { signal: '(datum.startAngle + datum.endAngle)/2' },
          fill:     { value: '#FFF' },
          align:    { value: 'center' },
          baseline: { value: 'middle' },
          text:     { field: 'label' }
        }
      }
    }]
}
