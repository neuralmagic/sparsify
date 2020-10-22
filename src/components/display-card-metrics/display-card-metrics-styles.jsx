import { makeStyles } from "@material-ui/core/styles";

export default function makeDisplayCardMetricsStyles() {
  return makeStyles(
    (theme) => {
      return {
        layout: {
          width: `calc(192px - ${theme.spacing(4)}px)`,
          height: "100%",
          paddingRight: theme.spacing(4),
          display: "flex",
          flexDirection: "column",
          position: "relative",
        },
        swipeContainer: {
          width: "100%",
          flex: "1 0",
        },
        swipable: {
          width: "100%",
          height: "100%",
        },
        swipableSlide: {
          width: "100%",
          height: "100%",
        },
        groupLayout: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },

        divider: {
          position: "absolute",
          width: "1px",
          height: "100%",
          backgroundColor: theme.palette.divider,
          right: theme.spacing(2),
        },

        metrics: {
          width: `calc(192px - ${theme.spacing(4)}px)`,
          height: "100%",
          paddingRight: theme.spacing(4),
          display: "flex",
          flexDirection: "column",
          position: "relative",
        },
        metric: {
          marginBottom: theme.spacing(2),
        },
      };
    },
    { name: "DisplayCardMetrics" }
  );
}
