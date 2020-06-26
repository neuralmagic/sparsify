/**
 * Vega chart specification for a bars chart with a time-based
 * horizontal axis.
 * @see https://vega.github.io/vega/docs/
 */

export default ({
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
    color: {
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
