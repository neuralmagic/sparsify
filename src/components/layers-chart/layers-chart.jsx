import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import makeStyles from "./layers-chart-styles";
import * as d3 from "d3";

const useStyles = makeStyles();

const LayersChart = (props) => {
  const margin = { top: 10, bottom: 20, left: 25, right: 20 };
  const chartHeight = 250;
  const ref = useRef();
  const classes = useStyles();

  useEffect(() => {
    const root = d3.select(ref.current);

    root.append("g").attr("class", "xAxis");
    root.append("g").attr("class", "sparsityAxis");
    root.append("g").attr("class", "timingAxis");
    root.append("path").attr("class", "denseAreaPath");
    root.append("path").attr("class", "sparseAreaPath");
    root.append("path").attr("class", "sparsityPath");
    root.append("path").attr("class", "denseLinePath");
    root.append("path").attr("class", "sparseLinePath");
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
  }, []);

  useEffect(() => {
    draw(props);
  }, [props.data]);

  const draw = ({ data, sparsityProp, denseProp, sparseProp }) => {
    const root = d3.select(ref.current);
    const chartWidth = ref.current.parentElement.offsetWidth - 50;

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
        d3
          .axisLeft(sparsityY)
          .ticks(10)
          .tickSize(-chartWidth + margin.right + margin.left + 5)
      );

    const timingAxis = (g) =>
      g
        .attr("transform", `translate(${chartWidth - margin.left}, 0)`)
        .call(d3.axisRight(timingY).ticks(10));

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
    root.selectAll(".timingAxis").call(timingAxis);

    const circles = root
      .selectAll(".sparsityCircle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "sparsityCircle")
      .attr("cx", (d, index) => x(index + 1))
      .attr("cy", (d) => sparsityY(d[sparsityProp] * 100));

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
  };

  return (
    <div className={classes.root}>
      <svg ref={ref} />
    </div>
  );
};

LayersChart.propTypes = {
  data: PropTypes.array.isRequired,
  sparsityProp: PropTypes.string.isRequired,
  denseProp: PropTypes.string.isRequired,
  sparseProp: PropTypes.string.isRequired,
};

export default LayersChart;
