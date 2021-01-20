import { makeStyles } from "@material-ui/core/styles";

const axisTextStyle = (theme) => ({
  fill: "#BEBED5",
  fontSize: 8,
  fontFamily: theme.typography.fontFamily,
});

const legendItem = {
  width: 15,
  height: 13,
  marginRight: 4,
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
          "& .secondAxis line": {
            stroke: "none",
          },
          "& .xAxis line": {
            stroke: "none",
          },
          "& .xAxis path": {
            stroke: "none",
          },
          "& .xAxis text": {
            ...axisTextStyle(theme),
          },
          "& .sparsityAxis text": {
            ...axisTextStyle(theme),
          },
          "& .secondAxis text": {
            ...axisTextStyle(theme),
          },
          "& .sparsityAxis path": {
            stroke: "none",
          },
          "& .secondAxis path": {
            stroke: "none",
          },
          "& .xAxisLabel, & .yAxisLabel": {
            ...axisTextStyle(theme),
            fill: "#C0C0C0",
            textAnchor: "middle",
          },
        },
        legend: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          marginTop: theme.spacing(2),
          marginLeft: 40,
          fontFamily: theme.typography.fontFamily,
          fontSize: 10,
        },
        sparsityLegend: {
          ...legendItem,
          height: 3,
          background: "#E19425",
        },
        denseLegend: {
          ...legendItem,
          borderTop: "2px solid #92cafd",
          background: "rgba(31, 120, 202, 0.5)",
        },
        sparseLegend: {
          ...legendItem,
          borderTop: "2px solid #6c86ff",
          background: "rgba(1, 41, 110, 0.5)",
        },
        legendText: {
          marginRight: theme.spacing(2),
        },
        tooltip: {
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          backgroundColor: "white",
          boxShadow: theme.shadows[1],
          padding: theme.spacing(2),
          zIndex: theme.zIndex.tooltip,
          fontFamily: theme.typography.fontFamily,
          fontSize: 14,
        },
        tooltipTitle: {
          fontSize: 20,
          marginBottom: theme.spacing(2),
        },
        tooltipLabels: {
          display: "inline-block",
          verticalAlign: "top",
        },
        tooltipValues: {
          display: "inline-block",
          verticalAlign: "top",
        },
        tooltipPropertyLabel: {
          fontSize: 12,
          color: "#76769C",
          display: "inline-block",
          marginBottom: theme.spacing(1),
          marginRight: theme.spacing(1),
          height: 20,
        },
        tooltipPropertyValue: {
          display: "inline-block",
          height: 20,
          fontSize: 12,
          marginBottom: theme.spacing(1),
        },
      };
    },
    { name: "LayersChart" }
  );
}
