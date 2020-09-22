import { makeStyles } from "@material-ui/core/styles"

export default function makeLayersChartStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          padding: 100
        },
      };
    },
    { name: "OptimPruning" }
  );
}
