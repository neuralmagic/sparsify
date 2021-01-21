import { makeStyles } from "@material-ui/core/styles";

export default function makeProjectStyles() {
  return makeStyles(
    (theme) => {
      return {
        layout: {
          display: "flex",
          flexDirection: "column",
          padding: theme.spacing(4),
          paddingTop: 0,
        },
        section: {
          marginTop: theme.spacing(4),
        },
        title: {
          marginBottom: theme.spacing(2),
        },
        inputSelect: {
          width: "100%",
          maxWidth: "256px",
        },
        inputNumber: {
          width: "100%",
          maxWidth: "128px",
          marginRight: theme.spacing(2),
        },
      };
    },
    { name: "Project" }
  );
}
