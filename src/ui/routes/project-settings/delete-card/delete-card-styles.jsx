import { makeStyles } from "@material-ui/core/styles";

export default function makeProjectStyles() {
  return makeStyles(
    (theme) => {
      return {
        layout: {
          padding: theme.spacing(4),
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        warning: {
          flex: "1 0",
        },
        button: {
          width: "192px",
          padding: theme.spacing(2),

          color: theme.palette.error.contrastText,
          backgroundColor: theme.palette.error.main,
          "&:hover": {
            backgroundColor: theme.palette.error.dark,
          },
        },
      };
    },
    { name: "Project" }
  );
}
