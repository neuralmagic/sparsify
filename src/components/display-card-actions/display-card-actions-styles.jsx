import { makeStyles } from "@material-ui/core/styles";

export default function makeDisplayCardActionsStyles() {
  return makeStyles(
    (theme) => {
      return {
        layout: {
          width: `calc(256px - ${theme.spacing(6)}px)`,
          height: "100%",
          paddingLeft: theme.spacing(6),
          display: "flex",
          flexDirection: "column",
        },
        margin: {
          marginTop: theme.spacing(3),
        },
      };
    },
    { name: "DisplayCardActions" }
  );
}
