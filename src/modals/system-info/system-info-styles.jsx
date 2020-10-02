import { makeStyles } from "@material-ui/core/styles";

export default function createSystemInfoStyles(theme) {
  return makeStyles(
    (theme) => {
      return {
        dialog: {
          padding: theme.spacing(2),
        },
        title: {
          paddingLeft: theme.spacing(2),
          fontSize: "72px",
          fontFamily: theme.typography.fontFamily,
        },
        logo: {
          height: "80px",
          width: "80px",
          "& .colorOne": {
            color: theme.palette.text.primary,
            fill: theme.palette.text.primary,
          },
        },
        trademark: {
          fontSize: "15px",
          color: theme.palette.text.primary,
          alignSelf: "start",
          paddingTop: theme.spacing(0.5),
          paddingLeft: theme.spacing(0.5),
        },
        block: {
          margin: theme.spacing(2, 0),
        },
        link: {
          color: theme.palette.text.primary,
          cursor: "pointer",
        },
      };
    },
    { name: "SystemInfo" }
  );
}
