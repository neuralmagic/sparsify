import { makeStyles } from "@material-ui/core/styles";

export default function makeDisplayActionStyles() {
  return makeStyles(
    (theme) => {
      return {
        card: {
          height: "fit-content",
          marginLeft: theme.spacing(2),
          marginRight: theme.spacing(2),
          maxWidth: "256px",
        },
        content: {
          height: "fit-content",
          display: "flex",
          flexDirection: "column",
        },
        icon: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          "& svg": {
            height: "128px",
            width: "128px",
            fill: theme.palette.primary.main,
          }
        },
        divider: {
          marginTop: theme.spacing(3),
          width: `calc(100% + ${theme.spacing(6)}px)`,
          marginLeft: -1 * theme.spacing(3),
        },
        header: {
          marginTop: theme.spacing(2),
          marginBottom: theme.spacing(1),
        }
      };
    },
    { name: "DisplayAction" }
  );
}
