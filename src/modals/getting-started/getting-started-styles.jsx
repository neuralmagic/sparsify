import { makeStyles } from "@material-ui/core/styles";

export default function makeGettingStartedStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          padding: theme.spacing(4, 2, 2),
        },
        dialog: {
          height: "100%",

          display: "flex",
        },
        dialogContent: {
          display: "flex",
          flexDirection: "column",
        },
        checkbox: {
          flexGrow: 1,
        },
        progress: {
          width: "100%",
        },
        content: {
          height: "90%",
        },
        hidden: {
          visibility: "hidden",
        },
        button: {
          marginLeft: theme.spacing(1),
        },
      };
    },
    { name: "GettingStarted" }
  );
}
