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
      };
    },
    { name: "Project" }
  );
}
