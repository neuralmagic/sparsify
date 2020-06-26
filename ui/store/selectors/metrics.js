export const overallMetrics = state => state.metrics.overall
export const metricsByType = state => ({
  time: state.metrics.time,
  parameters: state.metrics.parameters,
  flops: state.metrics.flops
})
