import { makeStyles } from "@material-ui/core/styles";

export default function makeDisplayCardStyles() {
  return makeStyles(
    (theme) => {
      return {
        card: {
          position: "relative",
          height: "320px",
          overflow: "unset",
        },
        content: {
          position: "relative",
          height: `calc(100% - 2 * ${theme.spacing(3)}px)`,
          display: "flex",
          flexDirection: "row",
          padding: theme.spacing(3),
        },
        actionButtons: {
          display: "flex",
          justifyContent: "flex-end",
          position: "absolute",
          top: theme.spacing(2),
          right: theme.spacing(2),
        },
        actionButton: {
          marginLeft: theme.spacing(1),
        },
      };
    },
    { name: "DisplayCard" }
  );
}
