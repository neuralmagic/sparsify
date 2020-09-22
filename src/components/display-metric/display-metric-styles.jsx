import { makeStyles } from "@material-ui/core/styles";

export default function makeDisplayMetricStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          display: "flex",
          flexDirection: "column",
        },
        title: {
          marginBottom: theme.spacing(1),
        },
        metric: {},
        metricLarge: {
          fontWeight: 300,
        },
      };
    },
    { name: "LoaderLayout" }
  );
}
