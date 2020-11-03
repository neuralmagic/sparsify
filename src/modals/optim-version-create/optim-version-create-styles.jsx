import { makeStyles } from "@material-ui/core/styles";

export default function createOptimVersionStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          width: "100%",
          display: "flex",
          flexDirection: "column",
        },
        cancelButton: {
          color: theme.palette.text.secondary,
        },
        dialog: {
          padding: theme.spacing(2),
        },
        loaderText: {
          marginTop: theme.spacing(3),
        },
        loaderContainer: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        },
        dialogContent: {
          height: "100%",
          flex: "1 1 auto",
          padding: theme.spacing(1, 3),
          overflowY: "hidden",
        },
        transitionGroup: {
          height: "100%",
        },
      };
    },
    { name: "CreateOptimVersion" }
  );
}
