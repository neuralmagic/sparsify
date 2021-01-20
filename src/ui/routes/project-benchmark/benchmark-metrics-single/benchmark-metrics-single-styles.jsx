import { makeStyles } from "@material-ui/core/styles";

export default function makeBenchmarkMetricsSingleStyles() {
  return makeStyles(
    (theme) => {
      return {
        metric: {
          marginBottom: theme.spacing(2),
        },
      };
    },
    { name: "BenchmarkMetricsSingle" }
  );
}
