import { makeStyles } from "@material-ui/core/styles";

export default function makeLayersChartStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          marginBottom: 15,
        },
        label: {
          fontSize: 10,
          color: theme.palette.text.secondary,
        },
        value: {
          fontSize: 26,
        },
      };
    },
    { name: "OptimPruning" }
  );
}
