import { makeStyles } from "@material-ui/core/styles";

export default function makeProfileSummaryCardStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          position: "relative",
        },
        layout: {
          display: "flex",
          flexDirection: "row",
          padding: theme.spacing(4),
          paddingTop: theme.spacing(5),
        },
        container: {
          flex: "1 1 0",
          width: 0,
          display: "flex",
          flexDirection: "column",
        },
        containerRow: {
          marginBottom: theme.spacing(3),
          width: "100%",
          display: "flex",
          flexDirection: "row",
        },
        containerColumn: {
          flex: "1 1 0",
          width: 0,
        },
        divider: {
          marginLeft: theme.spacing(3),
          marginRight: theme.spacing(3),
        },
        optimizeButton: {
          width: "100%",
          padding: theme.spacing(2),
          marginBottom: theme.spacing(1),
        },
      };
    },
    { name: "ProfileSummaryCard" }
  );
}
