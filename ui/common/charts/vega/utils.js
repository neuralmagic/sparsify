export const verticalLinearGradient = values => ({
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
