import { makeStyles } from "@material-ui/core/styles";

export default function makeBenchmarkPlotStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          height: "275px",
        },
        tooltipRoot: {
          padding: theme.spacing(1),
        },
        tooltipLayout: {
          display: "flex",
          flexDirection: "column",
        },
        tooltipHeader: {
          display: "flex",
          alignItems: "center",
          marginBottom: theme.spacing(1),
        },
        tooltipHeaderColor: {
          width: "16px",
          height: "16px",
          marginRight: theme.spacing(1),
          borderRadius: "16px",
        },
        tooltipValueRow: {
          display: "flex",
          marginBottom: theme.spacing(0.5),
        },
        tooltipValueRowLabel: {
          marginRight: theme.spacing(1),
        },
        chart: {
          height: "250px",
          display: "flex",
        },
        chartYAxis: {
          width: "60px",
          display: "flex",
          flexDirection: "column",
        },
        chartYAxisTitle: {
          flex: "1 0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        chartYAxisTitleRotation: {
          transform: "rotate(-90deg)",
        },
        chartYAxisNumberTop: {
          textAlign: "end",
        },
        chartYAxisNumberBottom: {
          textAlign: "end",
        },
        chartXAxis: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: "60px",
        },
        chartXAxisTitle: {
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      };
    },
    { name: "BenchmarkPlot" }
  );
}
