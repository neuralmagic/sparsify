import { makeStyles } from "@material-ui/core/styles";
import zIndex from "@material-ui/core/styles/zIndex";

export default function createHomeStyles() {
  return makeStyles(
    (theme) => {
      const paddingButton = theme.spacing(3);
      const positionButton = theme.spacing(4);

      return {
        content: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        },
        titleText: {
          width: `calc(100% - ${theme.spacing(8)}px)`,
          maxWidth: `calc(768px + ${theme.spacing(16)}px)`,
          marginLeft: theme.spacing(4),
          marginRight: theme.spacing(4),
          marginBottom: theme.spacing(6),
        },
        displayActions: {
          display: "flex",
          marginLeft: theme.spacing(2),
          marginRight: theme.spacing(2),
        },

        fab: {
          position: "fixed",
          right: `${positionButton}px`,
          bottom: `${positionButton}px`,
          padding: `${paddingButton}px`,
        },
        fabIcon: {
          marginRight: theme.spacing(1),
        },
        info: {
          top: theme.spacing(2),
          right: theme.spacing(2),
          position: "absolute",
          margin: theme.spacing(0.5),
          zIndex: 10,
        },
        infoButton: {
          padding: 0,
          margin: 0,

          "& svg": {
            fill: theme.palette.text.secondary,
            width: "32px",
            height: "32px",
          },
        },
      };
    },
    { name: "Home" }
  );
}
