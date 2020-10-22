import { isNil, reject, map, compose, join } from 'ramda';
import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import makeStyles from "./layers-chart-styles";
import * as d3 from "d3";

const useStyles = makeStyles();

const LayersChart = props => {
  const margin = { top: 10, bottom: 12, left: 40, right: props.secondPlot !== 'none' ? 20 : 0 };
  const chartHeight = 250;
  const ref = useRef();
  const tooltipRef = useRef();
  const classes = useStyles();

  useEffect(() => {
    const root = d3.select(ref.current);

    root.append("g").attr("class", "xAxis");
    root.append("g").attr("class", "sparsityAxis");
    root.append("path").attr("class", "sparsityPath");

    if (props.secondPlot !== 'none') {
      root.append("g").attr("class", "secondAxis");
      root.append("path").attr("class", "denseLinePath");
      root.append("path").attr("class", "denseAreaPath");
      root.append("path").attr("class", "sparseLinePath");
      root.append("path").attr("class", "sparseAreaPath");
    }
    root.append("g").attr("class", "sparsityCircles");

    root
      .append("linearGradient")
      .attr("id", "dense-area-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", 200)
      .selectAll("stop")
      .data([
        { offset: "0%", color: "rgba(129, 194, 255, 45)" },
        { offset: "100%", color: "rgba(129, 194, 255, 45)" },
      ])
      .enter()
      .append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color)
      .attr("stop-opacity", (d) => (d.offset === "100%" ? 0.1 : 1));

    root
      .append("linearGradient")
      .attr("id", "sparse-area-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", 200)
      .selectAll("stop")
      .data([
        { offset: "0%", color: "rgba(126, 155, 255, 45)" },
        { offset: "100%", color: "rgba(126, 155, 255, 45)" },
      ])
      .enter()
      .append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color)
      .attr("stop-opacity", (d) => (d.offset === "100%" ? 0.1 : 1));

    root.append('text').attr("class", "xAxisLabel");
    root.append('text').attr("class", "yAxisLabel");
  }, []);

  useEffect(() => {
    draw(props);
  }, [props.data]);

  const draw = ({ data, sparsityProp, denseProp, sparseProp }) => {
    const root = d3.select(ref.current);
    const chartWidth = ref.current.parentElement.offsetWidth - margin.left - margin.right;
    const tooltip = d3.select(tooltipRef.current);

    root
      .attr("width", chartWidth + margin.left + margin.right)
      .attr("height", chartHeight + margin.top + margin.bottom);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d, index) => index + 1))
      .range([margin.left, chartWidth - margin.right]);

    const sparsityY = d3
      .scaleLinear()
      .domain([0, 100])
      .range([chartHeight - margin.bottom, margin.top]);

    const timingY = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d3.max([d[denseProp], d[sparseProp]]))])
      .range([chartHeight - margin.bottom, margin.top]);

    const sparsityLine = d3
      .line()
      .x((d, index) => x(index + 1))
      .y((d) => sparsityY(d[sparsityProp] * 100));

    const denseArea = d3
      .area()
      .curve(d3.curveLinear)
      .x((d, index) => x(index + 1))
      .y0(timingY(0))
      .y1((d) => timingY(d[denseProp]));

    const sparseArea = d3
      .area()
      .curve(d3.curveLinear)
      .x((d, index) => x(index + 1))
      .y0(timingY(0))
      .y1((d) => timingY(d[sparseProp]));

    const sparseLine = d3
      .line()
      .x((d, index) => x(index + 1))
      .y((d) => timingY(d[sparseProp]));

    const denseLine = d3
      .line()
      .x((d, index) => x(index + 1))
      .y((d) => timingY(d[denseProp]));

    const xAxis = (g) =>
      g
        .attr("transform", `translate(0, ${chartHeight - margin.bottom})`)
        .call(d3.axisBottom(x).tickSize(0));

    const sparsityAxis = (g) =>
      g.attr("transform", `translate(${margin.left},0)`).call(
        d3.axisLeft(sparsityY)
          .ticks(10)
          .tickSize(-chartWidth + margin.right + margin.left)
      );

    let secondAxis;

    if (props.secondPlot !== 'none') {
      secondAxis = (g) =>
        g.attr("transform", `translate(${chartWidth - margin.left + margin.right}, 0)`)
          .call(d3.axisRight(timingY).ticks(10));
    }

    const sparsityPath = root
      .selectAll(".sparsityPath")
      .data([data])
      .attr("class", "sparsityPath");

    sparsityPath
      .transition()
      .duration(750)
      .attr("fill", "none")
      .attr("stroke", "#E79824")
      .attr("stroke-width", 2)
      .attr("d", sparsityLine);

    const denseAreaPath = root
      .selectAll(".denseAreaPath")
      .data([data])
      .attr("class", "denseAreaPath");

    denseAreaPath
      .transition()
      .duration(750)
      .attr("fill", "url(#dense-area-gradient)")
      .attr("d", denseArea);

    const sparseAreaPath = root
      .selectAll(".sparseAreaPath")
      .data([data])
      .attr("class", "sparseAreaPath");

    sparseAreaPath
      .transition()
      .duration(750)
      .attr("fill", "url(#sparse-area-gradient)")
      .attr("d", sparseArea);

    const sparseLinePath = root
      .selectAll(".sparseLinePath")
      .data([data])
      .attr("class", "sparseLinePath");

    sparseLinePath
      .transition()
      .duration(750)
      .attr("stroke", "rgba(126, 155, 255, 255)")
      .attr("stroke-width", 1)
      .attr("fill", "none")
      .attr("d", sparseLine);

    const denseLinePath = root
      .selectAll(".denseLinePath")
      .data([data])
      .attr("class", "denseLinePath");

    denseLinePath
      .transition()
      .duration(750)
      .attr("stroke", "rgba(129, 194, 255, 255)")
      .attr("stroke-width", 1)
      .attr("fill", "none")
      .attr("d", denseLine);

    root.selectAll(".xAxis").call(xAxis);
    root.selectAll(".sparsityAxis").call(sparsityAxis);

    if (secondAxis)
      root.selectAll(".secondAxis").call(secondAxis);

    const circles = root
      .selectAll(".sparsityCircle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "sparsityCircle")
      .attr("cx", (d, index) => x(index + 1))
      .attr("cy", d => sparsityY(d[sparsityProp] * 100))
      .attr("id", d => d.node_id);

    root
      .append('rect')
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr("width", chartWidth)
      .attr("height", chartHeight)
      .on('mouseover', () => tooltip.style("visibility", "visible"))
      .on('mousemove', event => {
        const index = Math.round(x.invert(d3.pointer(event)[0]));
        const selectedData = data[index - 1];

        if (selectedData) {
          const labels = compose(
            join(''),
            map(label => `<div><span class="${classes.tooltipPropertyLabel}">${label}</span></div>`),
            reject(isNil))(
            ['Layer', 'Sparsity', props.denseProp, props.sparseProp])

          const values = compose(
            join(''),
            map(value => `<div><span class="${classes.tooltipPropertyValue}">${value}</span></div>`),
            reject(isNil))([
            Math.max(index, 1),
            `${Math.round(selectedData.sparsity * 100)}%`,
            selectedData[props.denseProp],
            selectedData[props.sparseProp]
          ])

          tooltip.html(
            `<div class="${classes.tooltipTitle}">${props.layerData[selectedData.node_id].weight_name}</div>
             <div class="${classes.tooltipLabels}">${labels}</div>
             <div class="${classes.tooltipValues}">${values}</div>`)
            .style("margin-left", x(index) + 10 + "px")
            .style("margin-top", sparsityY(selectedData.sparsity * 100) + 10 + "px");

          root
            .selectAll(".sparsityCircle")
            .attr("r", 3)
            .attr("fill", "white")
            .filter((d, i) => i === index - 1)
            .attr("r", 6)
            .attr("fill", "#E79824");
        }
      })
      .on('mouseout', () => {
        tooltip.style("visibility", "hidden")
        root
          .selectAll(".sparsityCircle")
          .attr("fill", 'white')
          .attr("r", 3);
      });

    root
      .selectAll("circle")
      .transition()
      .duration(750)
      .attr("cx", (d, index) => x(index + 1))
      .attr("cy", (d) => sparsityY(d[sparsityProp] * 100))
      .attr("r", 3)
      .attr("fill", "white")
      .attr("stroke", "#E79824")
      .attr("stroke-width", 1);

    circles.exit().remove();

    root.select(".xAxisLabel")
      .attr("transform", "translate(" + chartWidth / 2 + " ," +(chartHeight + margin.top + margin.bottom) + ")")
      .text("Layer Index");

    root.select(".yAxisLabel")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", 0 - chartHeight / 2)
      .attr("dy", "1em")
      .text("Layer Sparsity %");
  };

  let secondPlotLegend;

  if (props.secondPlot !== 'none') {
    secondPlotLegend = <React.Fragment>
      <div className={classes.denseLegend}/>
      <span className={classes.legendText}>{props.denseProp}</span>
      <div className={classes.sparseLegend}/>
      <span className={classes.legendText}>{props.sparseProp}</span>
    </React.Fragment>
  }

  return (
    <div className={`${classes.root} ${props.className}`}>
      <svg ref={ref} />
      <div ref={tooltipRef} className={classes.tooltip}/>
      <div className={classes.legend}>
        <div className={classes.sparsityLegend}/>
        <span className={classes.legendText}>Sparsity</span>
        {secondPlotLegend}
      </div>
    </div>
  );
};

LayersChart.defaultProps = {
  secondPlot: 'none'
}

LayersChart.propTypes = {
  data: PropTypes.array.isRequired,
  layerData: PropTypes.object.isRequired,
  sparsityProp: PropTypes.string.isRequired,
  denseProp: PropTypes.string.isRequired,
  sparseProp: PropTypes.string.isRequired,
  secondPlot: PropTypes.string.isRequired
};

export default LayersChart;
