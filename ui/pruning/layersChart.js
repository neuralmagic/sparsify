import React, { useRef, useEffect } from 'react'
import { compose, reduce, concat, map, prop, merge, objOf, zipWith, addIndex } from 'ramda'
import { Component, fold, nothing, useStyles, toContainer, useSelector, fromElement, fromClass } from '../common/component'
import { sparsity, denseExecutionTimeData, sparseExecutionTimeData } from '../store/selectors/pruning'
import d3 from 'd3'

const mapIndexed = addIndex(map)

const axisTextStyle = {
  fill: '#BEBED5',
  fontSize: 8,
  fontFamily: '"Open Sans Regular", "Open Sans", "sans-serif"'
}

const styles = {
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    '& .sparsityAxis line': {
      stroke: '#F0F0F0'
    },
    '& .timingAxis line': {
      stroke: 'none'
    },
    '& .xAxis line': {
      stroke: 'none'
    },
    '& .xAxis path': {
      stroke: 'none'
    },
    '& .xAxis text': {
      ...axisTextStyle
    },
    '& .sparsityAxis text': {
      ...axisTextStyle
    },
    '& .timingAxis text': {
      ...axisTextStyle
    },
    '& .sparsityAxis path': {
      stroke: 'none'
    },
    '& .timingAxis path': {
      stroke: 'none'
    }
  },
  legend: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 20,
  }
}

const legendItemStyles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#AAAAAA',
    fontSize: 10,
    marginRight: 15
  },
  sparsity: {
    width: 15,
    height: 3,
    marginRight: 4,
    background: '#E19425'
  },
  denseExecTime: {
    width: 15,
    height: 13,
    marginRight: 4,
    borderTop: '2px solid #92cafd',
    background: 'rgba(31, 120, 202, 0.5)',
  },
  sparseExecTime: {
    width: 15,
    height: 13,
    marginRight: 4,
    borderTop: '2px solid #6c86ff',
    background: 'rgba(1, 41, 110, 0.5)',
  }
}

const computeChartData = ({ denseExecutionTimeData, sparseExecutionTimeData, sparsity }) => {
  const sparsityData = map(objOf('sparsity'), sparsity)
  const denseData = map(objOf('denseExecTime'), denseExecutionTimeData)
  const sparseData = map(objOf('sparseExecTime'), sparseExecutionTimeData)

  const chartData = compose(
    mapIndexed((v, index) => merge(v, { layer: index + 1 })),
    zipWith(merge, sparsityData),
    zipWith(merge, denseData))(
    sparseData)

  return chartData
}

const legendItem = Component(props => compose(
  fold(props),
  useStyles(legendItemStyles),
  map(toContainer({ className: prop('root') })),
  reduce(concat, nothing()))([
  fromElement('div').contramap(props => ({ className: props.classes[props.type] })),
  fromElement('span').contramap(props => ({ children: props.label }))]))

const legend = Component(props => compose(
  fold(props),
  map(toContainer({ className: props.classes.legend })),
  reduce(concat, nothing()),
  map(compose(legendItem.contramap, merge)))(
  [
    { type: 'sparsity', label: 'Sparsity' },
    { type: 'denseExecTime', label: 'Dense Exec. Time' },
    { type: 'sparseExecTime', label: 'Sparse Exec. Time' },
  ]))

const chart = props => {
  const margin = { top: 20, bottom: 20, left: 25, right: 20 }
  const chartHeight = 250
  const ref = useRef()

  useEffect(() => {
    const root = d3.select(ref.current)

    root.append('g')
      .attr('class', 'xAxis')
    root.append('g')
      .attr('class', 'sparsityAxis')
    root.append('g')
      .attr('class', 'timingAxis')
    root.append('path')
      .attr('class', 'denseAreaPath')
    root.append('path')
      .attr('class', 'sparseAreaPath')
    root.append('path')
      .attr('class', 'sparsityPath')
    root.append('path')
      .attr('class', 'denseLinePath')
    root.append('path')
      .attr('class', 'sparseLinePath')
    root.append('g')
      .attr('class', 'sparsityCircles')

    root.append('linearGradient')
      .attr('id', 'dense-area-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', 0)
      .attr('x2', 0).attr('y2', 200)
      .selectAll('stop')
      .data([
        { offset: '0%', color: 'rgba(129, 194, 255, 45)' },
        { offset: '100%', color: 'rgba(129, 194, 255, 45)' }
      ])
      .enter().append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color)
      .attr('stop-opacity', d => d.offset === '100%' ? 0.1 : 1)

    root.append('linearGradient')
      .attr('id', 'sparse-area-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', 0)
      .attr('x2', 0).attr('y2', 200)
      .selectAll('stop')
      .data([
        { offset: '0%', color: 'rgba(126, 155, 255, 45)' },
        { offset: '100%', color: 'rgba(126, 155, 255, 45)' }
      ])
      .enter().append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color)
      .attr('stop-opacity', d => d.offset === '100%' ? 0.1 : 1)
  }, [])

  useEffect(() => {
    draw(props)
  }, [props.denseExecutionTimeData, props.sparseExecutionTimeData, props.sparsity])

  const draw = props => {
    const data = computeChartData(props)
    const root = d3.select(ref.current)
    const chartWidth = ref.current.parentElement.offsetWidth - 50

    root
      .attr('width', chartWidth + margin.left + margin.right)
      .attr('height', chartHeight + margin.top + margin.bottom)

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.layer))
      .range([margin.left, chartWidth - margin.right])

    const sparsityY = d3
      .scaleLinear()
      .domain([0, 100])
      .range([chartHeight - margin.bottom, margin.top])

    const timingY = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d3.max([d.denseExecTime, d.sparseExecTime]))])
      .range([chartHeight - margin.bottom, margin.top])

    const sparsityLine = d3
      .line()
      .x(d => x(d.layer))
      .y(d => sparsityY(d.sparsity * 100))

    const denseArea = d3
      .area()
      .curve(d3.curveLinear)
      .x(d => x(d.layer))
      .y0(timingY(0))
      .y1(d => timingY(d.denseExecTime))

    const sparseArea = d3
      .area()
      .curve(d3.curveLinear)
      .x(d => x(d.layer))
      .y0(timingY(0))
      .y1(d => timingY(d.sparseExecTime))

    const sparseLine = d3
      .line()
      .x(d => x(d.layer))
      .y(d => timingY(d.sparseExecTime))

    const denseLine = d3
      .line()
      .x(d => x(d.layer))
      .y(d => timingY(d.denseExecTime))

    const xAxis = g => g
      .attr('transform', `translate(0, ${chartHeight - margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(0))

    const sparsityAxis = g => g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(sparsityY).ticks(10).tickSize(-chartWidth + margin.right + margin.left + 5))

    const timingAxis = g => g
      .attr('transform', `translate(${chartWidth - margin.left}, 0)`)
      .call(d3.axisRight(timingY).ticks(10))

    const sparsityPath = root.selectAll('.sparsityPath')
      .data([data])
      .attr('class', 'sparsityPath')

    sparsityPath.transition().duration(750)
      .attr('fill', 'none')
      .attr('stroke', '#E79824')
      .attr('stroke-width', 2)
      .attr('d', sparsityLine)

    const denseAreaPath = root.selectAll('.denseAreaPath')
      .data([data])
      .attr('class', 'denseAreaPath')

    denseAreaPath.transition().duration(750)
      .attr('fill', 'url(#dense-area-gradient)')
      .attr('d', denseArea)

    const sparseAreaPath = root.selectAll('.sparseAreaPath')
      .data([data])
      .attr('class', 'sparseAreaPath')

    sparseAreaPath.transition().duration(750)
      .attr('fill', 'url(#sparse-area-gradient)')
      .attr('d', sparseArea)

    const sparseLinePath = root.selectAll('.sparseLinePath')
      .data([data])
      .attr('class', 'sparseLinePath')

    sparseLinePath.transition().duration(750)
      .attr('stroke', 'rgba(126, 155, 255, 255)')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .attr('d', sparseLine)

    const denseLinePath = root.selectAll('.denseLinePath')
      .data([data])
      .attr('class', 'denseLinePath')

    denseLinePath.transition().duration(750)
      .attr('stroke', 'rgba(129, 194, 255, 255)')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .attr('d', denseLine)

    root.selectAll('.xAxis')
      .call(xAxis)
    root.selectAll('.sparsityAxis')
      .call(sparsityAxis)
    root.selectAll('.timingAxis')
      .call(timingAxis)

    const circles = root.selectAll('.sparsityCircle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'sparsityCircle')
      .attr('cx', d => x(d.layer))
      .attr('cy', d => sparsityY(d.sparsity * 100))

    root.selectAll('circle')
      .transition().duration(750)
      .attr('cx', d => x(d.layer))
      .attr('cy', d => sparsityY(d.sparsity * 100))
      .attr('r', 3)
      .attr('fill', 'white')
      .attr('stroke', '#E79824')
      .attr('stroke-width', 1)

    circles.exit().remove()
  }

  return <svg ref={ref}/>
}

export default Component(props => compose(
  fold(props),
  useStyles(styles),
  useSelector('sparsity', sparsity(props.modifier)),
  useSelector('denseExecutionTimeData', denseExecutionTimeData),
  useSelector('sparseExecutionTimeData', sparseExecutionTimeData(props.modifier)),
  map(toContainer({ className: classes => `${classes.root} ${props.classes.root}` })),
  reduce(concat, nothing()))([
  fromClass(chart),
  legend]))
