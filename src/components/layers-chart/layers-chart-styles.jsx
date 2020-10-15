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
            ...axisTextStyle,
          },
          "& .sparsityAxis text": {
            ...axisTextStyle,
          },
          "& .secondAxis text": {
            ...axisTextStyle,
          },
          "& .sparsityAxis path": {
            stroke: "none",
          },
          "& .secondAxis path": {
            stroke: "none",
          },
          "& .xAxisLabel, & .yAxisLabel": {
            ...axisTextStyle,
            fill: "#C0C0C0",
            textAnchor: 'middle',
          },
        },
        legend: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingRight: 20,
        },
        tooltip: {
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
          backgroundColor: 'white',
          boxShadow: theme.shadows[1],
          padding: theme.spacing(2),
          zIndex: theme.zIndex.tooltip,
          fontFamily: theme.typography.fontFamily,
          fontSize: 14
        },
        tooltipTitle: {
          fontSize: 20,
          marginBottom: theme.spacing(2)
        },
        tooltipLabels: {
          display: 'inline-block',
          verticalAlign: 'top'
        },
        tooltipValues: {
          display: 'inline-block',
          verticalAlign: 'top'
        },
        tooltipPropertyLabel: {
          fontSize: 12,
          color: '#76769C',
          display: 'inline-block',
          marginBottom: theme.spacing(1),
          marginRight: theme.spacing(1),
          height: 20
        },
        tooltipPropertyValue: {
          display: 'inline-block',
          height: 20,
          fontSize: 12,
          marginBottom: theme.spacing(1),
        }
      };
    },
    { name: "LayersChart" }
  );
}
