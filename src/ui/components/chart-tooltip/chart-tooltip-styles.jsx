import { makeStyles } from "@material-ui/core/styles";

export default function makeChartTooltipStyles() {
  return makeStyles(
    (theme) => {
      return {
        positioning: {
          width: 0,
          height: 0,
          position: "relative",
        },
        root: {
          position: "absolute",
          top: theme.spacing(3),
          left: -1 * theme.spacing(16),
          width: theme.spacing(32),
          padding: theme.spacing(1),
        },
        layout: {
          display: "flex",
          flexDirection: "column",
        },
        header: {
          display: "flex",
          alignItems: "center",
          marginBottom: theme.spacing(1),
        },
        headerColor: {
          width: "16px",
          height: "16px",
          marginRight: theme.spacing(1),
          borderRadius: "16px",
        },
        metrics: {
          width: "100%",
          display: "flex",
          flexDirection: "column",
        },
        metric: {
          display: "flex",
          marginBottom: theme.spacing(0.5),
          alignItems: "center",
          width: "100%",
        },
        metricLabel: {
          marginRight: theme.spacing(1),
          display: "block",
          float: "left",
          flexShrink: "0",
        },
        metricValue: {
          flex: "1 0",
          width: 0,
          wordWrap: "break-word",
        },
      };
    },
    { name: "ChartTooltip" }
  );
}
