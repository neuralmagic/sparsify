import { makeStyles } from "@material-ui/core/styles";

export default function makeProjectStyles() {
  return makeStyles(
    (theme) => {
      return {
        content: {
          display: "flex",
          flexDirection: "column",
        },
        textInput: {
          width: "100%",
          maxWidth: "288px",
          marginTop: theme.spacing(2),
        },
        deleteButton: {
          color: theme.palette.error.main,
        },
      };
    },
    { name: "Project" }
  );
}
