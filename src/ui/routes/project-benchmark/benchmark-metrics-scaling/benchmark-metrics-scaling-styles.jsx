import { makeStyles } from "@material-ui/core/styles";

export default function makeBenchmarkMetricsScalingStyles() {
  return makeStyles(
    (theme) => {
      return {
        metric: {
          marginBottom: theme.spacing(2),
        },
      };
    },
    { name: "BenchmarkMetricsScaling" }
  );
}
