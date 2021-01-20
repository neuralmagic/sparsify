import { makeStyles } from "@material-ui/core/styles";

export default function makeBenchmarkScalingStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          padding: theme.spacing(1, 4, 0),
          position: "relative",
        },
        metricsRoot: {},
        metric: {
          marginBottom: theme.spacing(2),
        },
        scalingSelection: {
          alignItems: "top",
          marginLeft: theme.spacing(2),
        },
        divider: {
          height: "250px",
        },
        editButton: {
          position: "absolute",
          right: theme.spacing(3),
          top: theme.spacing(2),
        },
        chart: {
          flex: "1 1 auto",
        },
        textButton: {
          textTransform: "none",
          justifyContent: "flex-start",
        },
        tabs: {
          flexGrow: 1,
          marginBottom: theme.spacing(1),
        },
      };
    },
    { name: "BenchmarkScalingScaling" }
  );
}
