import { makeStyles } from "@material-ui/core/styles";

export default function makeTrainingSummaryCardStyles() {
  return makeStyles(
    (theme) => {
      return {
        card: {
          height: "fit-content",
        },
        rowsLayout: {
          flex: "1 0",
          paddingLeft: "192px",
          paddingTop: theme.spacing(4),
          paddingBottom: theme.spacing(4),
        },
        rows: {
          width: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(1),
        },
        rowsXLabel: {
          position: "absolute",
          top: `calc(100% + ${theme.spacing(2.5)}px)`,
          fontSize: "0.7rem",
        },
      };
    },
    { name: "TrainingSummaryCard" }
  );
}
