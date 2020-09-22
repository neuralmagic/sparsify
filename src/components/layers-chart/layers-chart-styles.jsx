import { makeStyles } from "@material-ui/core/styles";

const axisTextStyle = {
  fill: "#BEBED5",
  fontSize: 8,
  fontFamily: '"Open Sans Regular", "Open Sans", "sans-serif"',
};

export default function makeLayersChartStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          position: "relative",
          display: "flex",
          flexDirection: "column",
          "& .sparsityAxis line": {
            stroke: "#F0F0F0",
          },
          "& .timingAxis line": {
            stroke: "none",
          },
          "& .xAxis line": {
            stroke: "none",
          },
          "& .xAxis path": {
            stroke: "none",
          },
          "& .xAxis text": {
            ...axisTextStyle,
          },
          "& .sparsityAxis text": {
            ...axisTextStyle,
          },
          "& .timingAxis text": {
            ...axisTextStyle,
          },
          "& .sparsityAxis path": {
            stroke: "none",
          },
          "& .timingAxis path": {
            stroke: "none",
          },
        },
        legend: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingRight: 20,
        },
      };
    },
    { name: "LayersChart" }
  );
}
