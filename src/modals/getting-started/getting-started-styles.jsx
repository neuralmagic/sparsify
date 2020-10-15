import { makeStyles } from "@material-ui/core/styles";

export default function makeGettingStartedStyles() {
  return makeStyles(
    (theme) => {
      return {
        content: {
          display: "flex",
          flexDirection: "column",
          maxWidth: "512px",
          marginTop: theme.spacing(2),
        },
        instruction: {
          display: "flex",
          alignItems: "center",
          marginBottom: theme.spacing(4),
        },
        instructionNumber: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minWidth: "56px",
          minHeight: "56px",
          marginRight: theme.spacing(4),
          border: "solid",
          borderRadius: "100%",
          borderColor: theme.palette.primary.main,
        },
        instructionText: {
          fontWeight: "100",
        },
        dialogActions: {
          paddingLeft: theme.spacing(3),
          paddingRight: theme.spacing(3),
          paddingBottom: theme.spacing(2),
        },

        checkbox: {
          flexGrow: 1,
        },
      };
    },
    { name: "GettingStarted" }
  );
}
