import { makeStyles } from "@material-ui/core/styles";

export default function makeBenchmarkMetricsComparisonStyles() {
  return makeStyles(
    (theme) => {
      return {
        metric: {
          marginBottom: theme.spacing(2),
        },
      };
    },
    { name: "BenchmarkMetricsComparison" }
  );
}
