import { makeStyles } from "@material-ui/core/styles";

export default function makeEpochRangeStyles() {
  return makeStyles(
    (theme) => {
      return {
        layout: {
          display: "flex",
          flexDirection: "column",
        },
        label: {
          marginBottom: theme.spacing(2),
        },
        range: {
          display: "flex",
          alignItems: "center",
        },
        dash: {
          width: theme.spacing(3),
          height: "2px",
          backgroundColor: theme.palette.divider,
        },
      };
    },
    { name: "EpochRange" }
  );
}
