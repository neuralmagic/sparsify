import { makeStyles } from "@material-ui/core/styles";

export default function makeLearningRateChartStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          width: "100%",
          height: `calc(100% - ${theme.spacing(3)}px)`,
          marginBottom: theme.spacing(3),
          display: "flex",
          flexDirection: "column",
          padding: 0,
          margin: 0,
        },
        chart: {
          height: "100%",
          display: "flex",
        },
        chartAxisTitle: {
          fontSize: "0.7rem",
        },
        chartYAxis: {
          width: theme.spacing(2),
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
        chartYAxisNumber: {
          textAlign: "end",
          fontSize: "0.7rem",
        },
        chartXAxis: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: theme.spacing(1),
          marginLeft: theme.spacing(2),
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
      };
    },
    { name: "LearningRateChart" }
  );
}
